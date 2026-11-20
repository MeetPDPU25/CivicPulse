const { pool } = require('../config/db');

// Helper to generate unique tracking ID (CIV-2026-0001)
async function generateTrackingId() {
  const year = new Date().getFullYear();
  const [rows] = await pool.query(
    "SELECT tracking_id FROM complaints WHERE tracking_id LIKE ? ORDER BY complaint_id DESC LIMIT 1",
    [`CIV-${year}-%`]
  );

  let nextNum = 1;
  if (rows.length > 0) {
    const parts = rows[0].tracking_id.split('-');
    const currentNum = parseInt(parts[2], 10);
    if (!isNaN(currentNum)) {
      nextNum = currentNum + 1;
    }
  }

  const paddedNum = String(nextNum).padStart(4, '0');
  return `CIV-${year}-${paddedNum}`;
}

exports.createComplaint = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { title, category, description, location_address, latitude, longitude } = req.body;
    const userId = req.user.user_id;

    if (!title || !category || !description || !location_address) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, description, and location are required'
      });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const trackingId = await generateTrackingId();

    await conn.beginTransaction();

    const [insertResult] = await conn.query(
      `INSERT INTO complaints 
       (tracking_id, user_id, title, category, description, location_address, latitude, longitude, image_url, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', 'Medium')`,
      [
        trackingId,
        userId,
        title,
        category,
        description,
        location_address,
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        imageUrl
      ]
    );

    const complaintId = insertResult.insertId;

    // Log in status history
    await conn.query(
      `INSERT INTO status_history (complaint_id, status, comment, updated_by)
       VALUES (?, 'SUBMITTED', 'Complaint submitted with initial details and location', ?)`,
      [complaintId, userId]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      tracking_id: trackingId,
      complaint_id: complaintId
    });
  } catch (error) {
    await conn.rollback();
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting complaint' });
  } finally {
    conn.release();
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [complaints] = await pool.query(
      `SELECT c.*, d.department_name, s.name AS staff_name
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.department_id
       LEFT JOIN users s ON c.assigned_staff_id = s.user_id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    console.error('Error fetching my complaints:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaints' });
  }
};

exports.getComplaintByTrackingId = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const [rows] = await pool.query(
      `SELECT c.*, u.name AS citizen_name, u.email AS citizen_email, u.phone AS citizen_phone,
              d.department_name, d.contact_phone AS department_phone,
              s.name AS staff_name, s.phone AS staff_phone
       FROM complaints c
       JOIN users u ON c.user_id = u.user_id
       LEFT JOIN departments d ON c.department_id = d.department_id
       LEFT JOIN users s ON c.assigned_staff_id = s.user_id
       WHERE c.tracking_id = ?`,
      [trackingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = rows[0];

    // Fetch timeline/status_history
    const [history] = await pool.query(
      `SELECT sh.*, u.name AS updater_name, u.role AS updater_role
       FROM status_history sh
       LEFT JOIN users u ON sh.updated_by = u.user_id
       WHERE sh.complaint_id = ?
       ORDER BY sh.created_at ASC`,
      [complaint.complaint_id]
    );

    res.json({ success: true, complaint, history });
  } catch (error) {
    console.error('Error getting complaint details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaint details' });
  }
};

exports.verifyAndCloseComplaint = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { trackingId } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user.user_id;

    const [rows] = await conn.query('SELECT * FROM complaints WHERE tracking_id = ?', [trackingId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = rows[0];

    // Must be owner citizen or admin
    if (complaint.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only verify your own complaints' });
    }

    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({
        success: false,
        message: `Complaint is currently '${complaint.status}'. Only 'RESOLVED' complaints can be verified and closed.`
      });
    }

    await conn.beginTransaction();

    await conn.query(
      `UPDATE complaints
       SET status = 'CLOSED', citizen_rating = ?, citizen_feedback = ?
       WHERE complaint_id = ?`,
      [parseInt(rating, 10) || 5, feedback || 'Citizen verified repair quality and closed the ticket.', complaint.complaint_id]
    );

    await conn.query(
      `INSERT INTO status_history (complaint_id, status, comment, updated_by)
       VALUES (?, 'CLOSED', ?, ?)`,
      [
        complaint.complaint_id,
        `Citizen verified resolution (${rating}★): "${feedback || 'No comments'}"`,
        userId
      ]
    );

    await conn.commit();

    res.json({ success: true, message: 'Complaint successfully verified and marked as CLOSED!' });
  } catch (error) {
    await conn.rollback();
    console.error('Error closing complaint:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  } finally {
    conn.release();
  }
};
