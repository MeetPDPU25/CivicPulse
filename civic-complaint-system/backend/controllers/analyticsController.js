const { pool } = require('../config/db');

exports.getAnalytics = async (req, res) => {
  try {
    // 1. Overall Counts
    const [totalRows] = await pool.query('SELECT COUNT(*) AS total FROM complaints');
    const [pendingRows] = await pool.query("SELECT COUNT(*) AS pending FROM complaints WHERE status IN ('SUBMITTED', 'UNDER REVIEW')");
    const [inProgressRows] = await pool.query("SELECT COUNT(*) AS in_progress FROM complaints WHERE status IN ('ASSIGNED', 'IN PROGRESS')");
    const [resolvedRows] = await pool.query("SELECT COUNT(*) AS resolved FROM complaints WHERE status IN ('RESOLVED', 'CLOSED')");

    // 2. By Category
    const [categoryRows] = await pool.query(
      `SELECT category, COUNT(*) as count 
       FROM complaints 
       GROUP BY category 
       ORDER BY count DESC`
    );

    // 3. By Status
    const [statusRows] = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM complaints 
       GROUP BY status 
       ORDER BY FIELD(status, 'SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED')`
    );

    // 4. By Priority
    const [priorityRows] = await pool.query(
      `SELECT priority, COUNT(*) as count 
       FROM complaints 
       GROUP BY priority 
       ORDER BY FIELD(priority, 'Urgent', 'High', 'Medium', 'Low')`
    );

    // 5. By Department
    const [deptRows] = await pool.query(
      `SELECT COALESCE(d.department_name, 'Unassigned') as department, COUNT(*) as count
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.department_id
       GROUP BY d.department_name
       ORDER BY count DESC`
    );

    res.json({
      success: true,
      stats: {
        total: totalRows[0].total,
        pending: pendingRows[0].pending,
        in_progress: inProgressRows[0].in_progress,
        resolved: resolvedRows[0].resolved
      },
      charts: {
        byCategory: categoryRows,
        byStatus: statusRows,
        byPriority: priorityRows,
        byDepartment: deptRows
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};
