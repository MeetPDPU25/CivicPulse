const bcrypt = require('bcryptjs');
const { pool, initDB } = require('../config/db');

async function seed() {
  await initDB();
  const conn = await pool.getConnection();

  try {
    console.log('🌱 Seeding demo data with local curated civic issue images...');

    // Clear existing data (disable foreign key checks temporarily)
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE status_history');
    await conn.query('TRUNCATE TABLE assignments');
    await conn.query('TRUNCATE TABLE complaints');
    await conn.query('TRUNCATE TABLE users');
    await conn.query('TRUNCATE TABLE departments');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // 1. Departments
    const departments = [
      ['Road Maintenance', 'roads@civic.gov', '+91 98765 00001'],
      ['Sanitation', 'sanitation@civic.gov', '+91 98765 00002'],
      ['Electrical Department', 'electrical@civic.gov', '+91 98765 00003'],
      ['Water & Drainage', 'water@civic.gov', '+91 98765 00004'],
      ['General Services', 'general@civic.gov', '+91 98765 00005']
    ];

    for (const dept of departments) {
      await conn.query(
        'INSERT INTO departments (department_name, head_email, contact_phone) VALUES (?, ?, ?)',
        dept
      );
    }
    console.log('✅ Departments seeded');

    // 2. Users (Admin, Staff, Citizens)
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // Admin
    await conn.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      ['Municipal Admin', 'admin@civic.gov', '+91 99000 00001', adminPasswordHash, 'admin']
    );

    // Field Staff (linked to departments)
    // Dept 1: Road Maintenance (ID 1)
    await conn.query(
      'INSERT INTO users (name, email, phone, password, role, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['Ramesh Kumar (Roads)', 'ramesh.staff@civic.gov', '+91 98111 00001', passwordHash, 'staff', 1]
    );
    // Dept 2: Sanitation (ID 2)
    await conn.query(
      'INSERT INTO users (name, email, phone, password, role, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['Suresh Sharma (Sanitation)', 'suresh.staff@civic.gov', '+91 98222 00002', passwordHash, 'staff', 2]
    );
    // Dept 3: Electrical (ID 3)
    await conn.query(
      'INSERT INTO users (name, email, phone, password, role, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['Vikram Patel (Electrical)', 'vikram.staff@civic.gov', '+91 98333 00003', passwordHash, 'staff', 3]
    );

    // Citizens
    const citizens = [
      ['Meet Patel', 'meet@student.pdpu.ac.in', '+91 91234 56789', passwordHash, 'citizen'],
      ['Aditya Jadeja', 'aditya@student.pdpu.ac.in', '+91 92345 67890', passwordHash, 'citizen'],
      ['Priya Sharma', 'priya@gmail.com', '+91 93456 78901', passwordHash, 'citizen']
    ];

    for (const c of citizens) {
      await conn.query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        c
      );
    }
    console.log('✅ Users seeded (1 Admin, 3 Staff, 3 Citizens)');

    // 3. Sample Complaints with local authentic images
    const sampleComplaints = [
      {
        tracking_id: 'CIV-2026-0001',
        user_id: 5, // Meet Patel
        title: 'Deep Asphalt Pothole on Main Boulevard',
        category: 'Road Damage & Potholes',
        description: 'Large hazardous asphalt crater measuring approx 2 feet wide right near the PDEU main entrance gate. Multiple two-wheelers have slipped at night.',
        location_address: 'PDEU Knowledge Corridor, Kudasan, Gandhinagar',
        latitude: 23.1557,
        longitude: 72.6669,
        image_url: '/uploads/pothole_issue.jpg',
        priority: 'High',
        status: 'CLOSED',
        department_id: 1,
        assigned_staff_id: 2, // Ramesh Kumar
        resolution_image_url: '/uploads/pothole_resolved.jpg',
        resolution_notes: 'Asphalt cold-mix patched and steam-rolled. Road surface restored to smooth grade.',
        citizen_rating: 5,
        citizen_feedback: 'Repaired swiftly within 24 hours. Smooth asphalt finish. Great work by the road crew!',
        history: [
          { status: 'SUBMITTED', comment: 'Complaint filed by citizen with GPS location.', user_id: 5 },
          { status: 'UNDER REVIEW', comment: 'Admin validated issue jurisdiction.', user_id: 1 },
          { status: 'ASSIGNED', comment: 'Assigned to Road Maintenance Department and Officer Ramesh Kumar.', user_id: 1 },
          { status: 'IN PROGRESS', comment: 'Field crew dispatched with asphalt patch roller.', user_id: 2 },
          { status: 'RESOLVED', comment: 'Pothole filled and sealed. Photo proof uploaded.', user_id: 2 },
          { status: 'CLOSED', comment: 'Citizen inspected the repair, rated 5/5 stars and closed the ticket.', user_id: 5 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0002',
        user_id: 6, // Aditya Jadeja
        title: 'Overflowing Municipal Garbage Dumpster',
        category: 'Garbage & Waste Dumping',
        description: 'Community waste bins have not been cleared for 4 days. Waste spilling onto the pavement creating a severe health hazard.',
        location_address: 'Sector 7 Market Circle, Gandhinagar',
        latitude: 23.2156,
        longitude: 72.6369,
        image_url: '/uploads/garbage_issue.jpg',
        priority: 'High',
        status: 'RESOLVED',
        department_id: 2,
        assigned_staff_id: 3, // Suresh Sharma
        resolution_image_url: '/uploads/garbage_resolved.jpg',
        resolution_notes: 'Compactor vehicle dispatched. Dumpster emptied and surrounding area bleached and disinfected.',
        citizen_rating: null,
        citizen_feedback: null,
        history: [
          { status: 'SUBMITTED', comment: 'Complaint filed with photo of overflowing dumpster.', user_id: 6 },
          { status: 'UNDER REVIEW', comment: 'Admin reviewed and flagged as Sanitation priority.', user_id: 1 },
          { status: 'ASSIGNED', comment: 'Assigned to Sanitation Dept - Suresh Sharma.', user_id: 1 },
          { status: 'IN PROGRESS', comment: 'Sanitation truck #GJ-18-B-4402 on site.', user_id: 3 },
          { status: 'RESOLVED', comment: 'Bins cleared and disinfected. Awaiting citizen verification.', user_id: 3 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0003',
        user_id: 7, // Priya Sharma
        title: 'Exposed High-Voltage Cable on Footpath',
        category: 'Streetlight & Electrical Issues',
        description: 'Underground cable joint box damaged during excavation. Bare wires exposed near children play park.',
        location_address: 'Infocity Road, Near TCS Circle, Gandhinagar',
        latitude: 23.1884,
        longitude: 72.6288,
        image_url: '/uploads/electrical_issue.jpg',
        priority: 'Urgent',
        status: 'IN PROGRESS',
        department_id: 3,
        assigned_staff_id: 4, // Vikram Patel
        resolution_image_url: null,
        resolution_notes: null,
        citizen_rating: null,
        citizen_feedback: null,
        history: [
          { status: 'SUBMITTED', comment: 'Urgent complaint submitted regarding exposed electrical wiring.', user_id: 7 },
          { status: 'UNDER REVIEW', comment: 'Admin escalated as URGENT electrical safety hazard.', user_id: 1 },
          { status: 'ASSIGNED', comment: 'Assigned immediately to Electrical Department - Vikram Patel.', user_id: 1 },
          { status: 'IN PROGRESS', comment: 'Power isolated on sub-feeder 3. Linemen currently replacing junction enclosure.', user_id: 4 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0004',
        user_id: 5, // Meet Patel
        title: 'Water Pipeline Burst Flooding Street',
        category: 'Water Supply & Drainage Issues',
        description: 'Main potable water supply pipe ruptured. High pressure clean water gushing across residential street for 2 hours.',
        location_address: 'Bhaijipura Cross Road, Koba, Gandhinagar',
        latitude: 23.1672,
        longitude: 72.6451,
        image_url: '/uploads/water_issue.jpg',
        priority: 'Urgent',
        status: 'ASSIGNED',
        department_id: 4,
        assigned_staff_id: null,
        resolution_image_url: null,
        resolution_notes: null,
        citizen_rating: null,
        citizen_feedback: null,
        history: [
          { status: 'SUBMITTED', comment: 'Pipeline rupture reported with flood water photo.', user_id: 5 },
          { status: 'UNDER REVIEW', comment: 'Admin reviewed and routed to Water & Drainage.', user_id: 1 },
          { status: 'ASSIGNED', comment: 'Assigned to Water & Drainage Department. Field crew dispatching.', user_id: 1 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0005',
        user_id: 6, // Aditya Jadeja
        title: 'Flickering Streetlights in Sector 21',
        category: 'Streetlight & Electrical Issues',
        description: 'Row of 4 LED street lamps cycling on and off every few seconds. Entire residential lane becomes pitch black.',
        location_address: 'Lane 4, Sector 21, Gandhinagar',
        latitude: 23.2351,
        longitude: 72.6512,
        image_url: '/uploads/streetlight_issue.jpg',
        priority: 'Medium',
        status: 'UNDER REVIEW',
        department_id: null,
        assigned_staff_id: null,
        resolution_image_url: null,
        resolution_notes: null,
        citizen_rating: null,
        citizen_feedback: null,
        history: [
          { status: 'SUBMITTED', comment: 'Complaint submitted by resident.', user_id: 6 },
          { status: 'UNDER REVIEW', comment: 'Under verification by municipal intake officer.', user_id: 1 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0006',
        user_id: 7, // Priya Sharma
        title: 'Construction Debris Dumped on Bicycle Track',
        category: 'Garbage & Waste Dumping',
        description: 'Truckload of brick and plaster debris dumped overnight on dedicated bicycle track.',
        location_address: 'Riverfront Green Corridor, Gandhinagar',
        latitude: 23.1902,
        longitude: 72.6710,
        image_url: '/uploads/debris_issue.jpg',
        priority: 'Medium',
        status: 'SUBMITTED',
        department_id: null,
        assigned_staff_id: null,
        resolution_image_url: null,
        resolution_notes: null,
        citizen_rating: null,
        citizen_feedback: null,
        history: [
          { status: 'SUBMITTED', comment: 'Citizen filed grievance with geo-tagged location.', user_id: 7 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0007',
        user_id: 5,
        title: 'Broken Storm Water Drain Cover',
        category: 'Water Supply & Drainage Issues',
        description: 'Cement drain slab broken and caved in. Pedestrians could fall into the storm ditch.',
        location_address: 'Near GH-5 Circle, Sector 16, Gandhinagar',
        latitude: 23.2201,
        longitude: 72.6410,
        image_url: '/uploads/drain_issue.jpg',
        priority: 'High',
        status: 'IN PROGRESS',
        department_id: 4,
        assigned_staff_id: 2,
        resolution_image_url: null,
        resolution_notes: null,
        citizen_rating: null,
        citizen_feedback: null,
        history: [
          { status: 'SUBMITTED', comment: 'Complaint logged.', user_id: 5 },
          { status: 'UNDER REVIEW', comment: 'Verified by admin.', user_id: 1 },
          { status: 'ASSIGNED', comment: 'Assigned to drainage field division.', user_id: 1 },
          { status: 'IN PROGRESS', comment: 'Replacement reinforced concrete slab ordered from casting yard.', user_id: 2 }
        ]
      },
      {
        tracking_id: 'CIV-2026-0008',
        user_id: 6,
        title: 'Overgrown Tree Branches Obstructing Stop Sign',
        category: 'Other',
        description: 'Banyan tree branches blocking visibility of traffic stop sign at busy 4-way intersection.',
        location_address: 'CH-Road Junction, Sector 11, Gandhinagar',
        latitude: 23.2100,
        longitude: 72.6300,
        image_url: '/uploads/tree_issue.jpg',
        priority: 'Low',
        status: 'CLOSED',
        department_id: 5,
        assigned_staff_id: 3,
        resolution_image_url: '/uploads/tree_resolved.jpg',
        resolution_notes: 'Horticulture team pruned branches with cherry-picker crane. Traffic sign now 100% visible.',
        citizen_rating: 4,
        citizen_feedback: 'Sign is clear now. Took a couple days but satisfied with response.',
        history: [
          { status: 'SUBMITTED', comment: 'Issue filed by citizen.', user_id: 6 },
          { status: 'ASSIGNED', comment: 'Assigned to General Services / Horticulture.', user_id: 1 },
          { status: 'RESOLVED', comment: 'Pruning completed, clear photo attached.', user_id: 3 },
          { status: 'CLOSED', comment: 'Citizen closed ticket with 4-star rating.', user_id: 6 }
        ]
      }
    ];

    for (const c of sampleComplaints) {
      const [res] = await conn.query(
        `INSERT INTO complaints 
        (tracking_id, user_id, title, category, description, location_address, latitude, longitude, image_url, priority, status, department_id, assigned_staff_id, resolution_image_url, resolution_notes, citizen_rating, citizen_feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          c.tracking_id,
          c.user_id,
          c.title,
          c.category,
          c.description,
          c.location_address,
          c.latitude,
          c.longitude,
          c.image_url,
          c.priority,
          c.status,
          c.department_id,
          c.assigned_staff_id,
          c.resolution_image_url,
          c.resolution_notes,
          c.citizen_rating,
          c.citizen_feedback
        ]
      );

      const complaintId = res.insertId;

      if (c.assigned_staff_id) {
        await conn.query(
          'INSERT INTO assignments (complaint_id, staff_id, assigned_by) VALUES (?, ?, ?)',
          [complaintId, c.assigned_staff_id, 1]
        );
      }

      for (const h of c.history) {
        await conn.query(
          'INSERT INTO status_history (complaint_id, status, comment, updated_by) VALUES (?, ?, ?, ?)',
          [complaintId, h.status, h.comment, h.user_id]
        );
      }
    }

    console.log(`✅ Seeded ${sampleComplaints.length} complaints with local authentic civic photos!`);
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
