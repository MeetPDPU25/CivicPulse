const { pool } = require('../config/db');

exports.getAssignedTasks = async (req, res) => {
  try {
    const staffId = req.user.user_id;

    const [tasks] = await pool.query(
      `SELECT c.*, u.name AS citizen_name, u.phone AS citizen_phone, u.email AS citizen_email,
              d.department_name
       FROM complaints c
       JOIN users u ON c.user_id = u.user_id
       LEFT JOIN departments d ON c.department_id = d.department_id
       WHERE c.assigned_staff_id = ?
       ORDER BY 
         CASE 
           WHEN c.status = 'ASSIGNED' THEN 1
           WHEN c.status = 'IN PROGRESS' THEN 2
           WHEN c.status = 'RESOLVED' THEN 3
           ELSE 4
         END,
         c.created_at DESC`,
      [staffId]
    );

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error('Error fetching staff tasks:', error);
    res.status(500).json({ success: false, message: 'Server error fetching assigned tasks' });
  }
};

exports.updateTaskProgress = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const staffId = req.user.user_id;

    const [rows] = await conn.query('SELECT * FROM complaints WHERE complaint_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = rows[0];
    if (complaint.assigned_staff_id !== staffId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Task is not assigned to you' });
    }

    await conn.beginTransaction();

    const newStatus = status || 'IN PROGRESS';
    await conn.query('UPDATE complaints SET status = ? WHERE complaint_id = ?', [newStatus, id]);

    await conn.query(
      'INSERT INTO status_history (complaint_id, status, comment, updated_by) VALUES (?, ?, ?, ?)',
      [id, newStatus, comment || 'Field staff initiated work on site', staffId]
    );

    await conn.commit();

    res.json({ success: true, message: `Task status updated to ${newStatus}` });
  } catch (error) {
    await conn.rollback();
    console.error('Error updating task progress:', error);
    res.status(500).json({ success: false, message: 'Server error updating task progress' });
  } finally {
    conn.release();
  }
};

exports.resolveTask = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;
    const staffId = req.user.user_id;

    const [rows] = await conn.query('SELECT * FROM complaints WHERE complaint_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = rows[0];
    if (complaint.assigned_staff_id !== staffId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Task is not assigned to you' });
    }

    let resolutionImageUrl = null;
    if (req.file) {
      resolutionImageUrl = `/uploads/${req.file.filename}`;
    }

    await conn.beginTransaction();

    await conn.query(
      `UPDATE complaints
       SET status = 'RESOLVED',
           resolution_notes = ?,
           resolution_image_url = COALESCE(?, resolution_image_url)
       WHERE complaint_id = ?`,
      [resolution_notes || 'Issue repaired on site. Work completed successfully.', resolutionImageUrl, id]
    );

    await conn.query(
      'INSERT INTO status_history (complaint_id, status, comment, updated_by) VALUES (?, ?, ?, ?)',
      [
        id,
        'RESOLVED',
        `Field staff marked resolved: "${resolution_notes || 'Work completed'}" (Proof photo attached)`,
        staffId
      ]
    );

    await conn.commit();

    res.json({
      success: true,
      message: 'Task successfully marked as RESOLVED! Proof photo recorded.',
      resolution_image_url: resolutionImageUrl
    });
  } catch (error) {
    await conn.rollback();
    console.error('Error resolving task:', error);
    res.status(500).json({ success: false, message: 'Server error while resolving task' });
  } finally {
    conn.release();
  }
};
