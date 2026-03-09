// Test script to check user API and assigned companies
const axios = require('axios');

async function testUserAPI() {
  try {
    // Test login as admin first
    console.log('=== Testing Admin Login ===');
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@test.com', // Replace with actual admin email
      password: 'password123'    // Replace with actual admin password
    });
    
    if (!loginResponse.data.success) {
      console.error('Login failed:', loginResponse.data.message);
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');
    
    // Test fetching all users
    console.log('\n=== Testing Get All Users ===');
    const usersResponse = await axios.get('http://localhost:5000/api/v1/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (usersResponse.data.success) {
      console.log('Users fetched successfully');
      console.log('Number of users:', usersResponse.data.data.length);
      
      // Find a pentester user
      const pentester = usersResponse.data.data.find(u => u.role === 'pentester');
      if (pentester) {
        console.log('\n=== Found Pentester ===');
        console.log('Pentester:', pentester.firstName, pentester.lastName);
        console.log('Assigned companies:', pentester.assignedCompanies);
        console.log('Assigned companies type:', typeof pentester.assignedCompanies);
        console.log('Assigned companies length:', pentester.assignedCompanies?.length);
        
        if (pentester.assignedCompanies && pentester.assignedCompanies.length > 0) {
          console.log('First assigned company:', pentester.assignedCompanies[0]);
          
          // Test fetching company details
          console.log('\n=== Testing Company Fetch ===');
          const companyId = pentester.assignedCompanies[0]._id || pentester.assignedCompanies[0];
          const companyResponse = await axios.get(
            `http://localhost:5000/api/v1/companies/${companyId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          console.log('Company response:', companyResponse.data);
        }
      } else {
        console.log('No pentester found in users');
      }
    } else {
      console.error('Failed to fetch users:', usersResponse.data.message);
    }
    
  } catch (error) {
    console.error('Test error:', error.response?.data || error.message);
  }
}

testUserAPI();
