const { pool } = require('../config/db');

exports.getAllComplaints = async (req, res) => {
  try {
    const { search, category, status, priority, department_id } = req.query;

    let sql = `
      SELECT c.*, u.name AS citizen_name, u.email AS citizen_email, u.phone AS citizen_phone,
             d.department_name, s.name AS staff_name
      FROM complaints c
      JOIN users u ON c.user_id = u.user_id
      LEFT JOIN departments d ON c.department_id = d.department_id
      LEFT JOIN users s ON c.assigned_staff_id = s.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (c.tracking_id LIKE ? OR c.title LIKE ? OR u.name LIKE ? OR c.location_address LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (category) {
      sql += ` AND c.category = ?`;
      params.push(category);
    }

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    if (priority) {
      sql += ` AND c.priority = ?`;
      params.push(priority);
    }

    if (department_id) {
      sql += ` AND c.department_id = ?`;
      params.push(department_id);
    }

    sql += ` ORDER BY c.created_at DESC`;

    const [complaints] = await pool.query(sql, params);
    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    console.error('Error fetching admin complaints:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaints' });
  }
};

exports.triageComplaint = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status, priority, department_id, assigned_staff_id, comment } = req.body;
    const adminId = req.user.user_id;

    const [rows] = await conn.query('SELECT * FROM complaints WHERE complaint_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const current = rows[0];
    const newStatus = status || current.status;
    const newPriority = priority || current.priority;
    const newDeptId = department_id !== undefined ? (department_id ? parseInt(department_id) : null) : current.department_id;
    const newStaffId = assigned_staff_id !== undefined ? (assigned_staff_id ? parseInt(assigned_staff_id) : null) : current.assigned_staff_id;

    await conn.beginTransaction();

    await conn.query(
      `UPDATE complaints
       SET status = ?, priority = ?, department_id = ?, assigned_staff_id = ?
       WHERE complaint_id = ?`,
      [newStatus, newPriority, newDeptId, newStaffId, id]
    );

    // If staff assignment changed and staff assigned, log in assignments table
    if (newStaffId && newStaffId !== current.assigned_staff_id) {
      await conn.query(
        'INSERT INTO assignments (complaint_id, staff_id, assigned_by, notes) VALUES (?, ?, ?, ?)',
        [id, newStaffId, adminId, comment || 'Assigned by administrator']
      );
    }

    // Status history log
    let historyComment = comment;
    if (!historyComment) {
      const parts = [];
      if (newStatus !== current.status) parts.push(`Status changed to ${newStatus}`);
      if (newPriority !== current.priority) parts.push(`Priority set to ${newPriority}`);
      if (newStaffId !== current.assigned_staff_id) parts.push(`Staff assigned (ID: ${newStaffId})`);
      historyComment = parts.join(', ') || 'Administrative details updated';
    }

    await conn.query(
      'INSERT INTO status_history (complaint_id, status, comment, updated_by) VALUES (?, ?, ?, ?)',
      [id, newStatus, historyComment, adminId]
    );

    await conn.commit();

    res.json({ success: true, message: 'Complaint triaged and updated successfully' });
  } catch (error) {
    await conn.rollback();
    console.error('Error triaging complaint:', error);
    res.status(500).json({ success: false, message: 'Server error triaging complaint' });
  } finally {
    conn.release();
  }
};

exports.getDepartmentsAndStaff = async (req, res) => {
  try {
    const [departments] = await pool.query('SELECT * FROM departments ORDER BY department_name ASC');
    const [staff] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.phone, u.department_id, d.department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE u.role = 'staff'
       ORDER BY u.name ASC`
    );

    res.json({ success: true, departments, staff });
  } catch (error) {
    console.error('Error fetching departments and staff:', error);
    res.status(500).json({ success: false, message: 'Server error fetching directory' });
  }
};
