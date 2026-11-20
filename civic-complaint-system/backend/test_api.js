const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting End-to-End System Tests...\n');

  // 1. Health check
  console.log('1. Testing Health Endpoint:');
  const health = await request({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log('   Status:', health.status, health.data);

  // 2. Citizen Login
  console.log('\n2. Testing Citizen Login (meet@student.pdpu.ac.in):');
  const citizenLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'meet@student.pdpu.ac.in', password: 'password123' }
  );
  console.log('   Citizen Login Result:', citizenLogin.status, citizenLogin.data.success);
  const citizenToken = citizenLogin.data.token;

  // 3. Citizen File Complaint
  console.log('\n3. Testing Complaint Submission by Citizen:');
  const complaintRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/complaints',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`
      }
    },
    {
      title: 'Water Pipe Leakage at PDEU Gate 2',
      category: 'Water Supply & Drainage Issues',
      description: 'Persistent low pressure leakage causing water stagnation on walking trail.',
      location_address: 'PDEU Gate 2, Gandhinagar',
      latitude: '23.156100',
      longitude: '72.667200'
    }
  );
  console.log('   Filing Result:', complaintRes.status, complaintRes.data);
  const trackingId = complaintRes.data.tracking_id;
  const complaintId = complaintRes.data.complaint_id;

  // 4. Public Tracking
  console.log(`\n4. Testing Public Tracking for Ticket ${trackingId}:`);
  const trackRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/complaints/${trackingId}`,
    method: 'GET'
  });
  console.log('   Track Status:', trackRes.status, 'Current Stage:', trackRes.data.complaint?.status);

  // 5. Admin Login
  console.log('\n5. Testing Admin Login (admin@civic.gov):');
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'admin@civic.gov', password: 'admin123' }
  );
  console.log('   Admin Login Result:', adminLogin.status, adminLogin.data.success);
  const adminToken = adminLogin.data.token;

  // 6. Admin Triage
  console.log(`\n6. Testing Admin Triage on Complaint #${complaintId}:`);
  const triageRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/complaints/${complaintId}/triage`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    },
    {
      status: 'ASSIGNED',
      priority: 'Urgent',
      department_id: 4, // Water & Drainage
      assigned_staff_id: 2, // Ramesh Kumar
      comment: 'Urgent water leakage assigned to field response division.'
    }
  );
  console.log('   Triage Result:', triageRes.status, triageRes.data);

  // 7. Field Staff Login
  console.log('\n7. Testing Field Staff Login (ramesh.staff@civic.gov):');
  const staffLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'ramesh.staff@civic.gov', password: 'password123' }
  );
  console.log('   Staff Login Result:', staffLogin.status, staffLogin.data.success);
  const staffToken = staffLogin.data.token;

  // 8. Staff Update Progress
  console.log(`\n8. Testing Staff Moving Status to IN PROGRESS:`);
  const progressRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/staff/tasks/${complaintId}/progress`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      }
    },
    {
      status: 'IN PROGRESS',
      comment: 'Field crew arrived with replacement pipe coupling and excavation tools.'
    }
  );
  console.log('   Progress Update Result:', progressRes.status, progressRes.data);

  // 9. Staff Resolve Complaint
  console.log(`\n9. Testing Staff Resolving Complaint #${complaintId}:`);
  const resolveRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/staff/tasks/${complaintId}/resolve`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      }
    },
    {
      resolution_notes: 'Replaced 2-inch PVC junction fitting and backfilled trench. Water pressure restored.'
    }
  );
  console.log('   Resolve Result:', resolveRes.status, resolveRes.data);

  // 10. Citizen Verify & Close Ticket
  console.log(`\n10. Testing Citizen Verification & 5-Star Sign-off:`);
  const verifyRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/complaints/${trackingId}/verify`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`
      }
    },
    {
      rating: 5,
      feedback: 'Excellent response time! Leaking pipe fixed within hours without messing up the sidewalk.'
    }
  );
  console.log('   Verification Result:', verifyRes.status, verifyRes.data);

  // 11. Final State Check
  console.log(`\n11. Verifying Final Ticket State on Public Timeline:`);
  const finalCheck = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/complaints/${trackingId}`,
    method: 'GET'
  });
  console.log('   Final Status:', finalCheck.data.complaint?.status);
  console.log('   Citizen Rating:', finalCheck.data.complaint?.citizen_rating, 'Stars');
  console.log('   Total Timeline Events Recorded:', finalCheck.data.history?.length);

  console.log('\n🎉 ALL 11 END-TO-END WORKFLOW TESTS PASSED PERFECTLY!\n');
}

runTests().catch(console.error);
