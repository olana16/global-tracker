// Test script to verify audit logging for employee additions
const mongoose = require('mongoose');
const Company = require('./models/Company');
const Person = require('./models/Person');
const User = require('./models/User');
const auditService = require('./services/auditService');

// Test data
const testEmployee = {
  firstName: 'Test',
  lastName: 'Employee',
  email: 'test.employee@example.com',
  position: 'Test Position',
  department: 'Test Department',
  company: 'Test Company',
  country: 'Test Country'
};

const testUser = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'Test',
  lastName: 'User',
  role: 'pentester'
};

async function testAuditLogging() {
  try {
    console.log('=== Testing Employee Audit Logging ===');
    
    // Test 1: Create a test company
    console.log('Creating test company...');
    const company = new Company({
      name: 'Test Company',
      country: 'Test Country',
      industry: 'Test Industry'
    });
    await company.save();
    console.log('Company created:', company._id);
    
    // Test 2: Log employee addition
    console.log('Logging employee addition...');
    await auditService.logCompanyChange(
      company._id,
      testUser._id,
      `${testUser.firstName} ${testUser.lastName}`,
      testUser.role,
      'add_employee',
      [{
        field: 'employee',
        newValue: {
          name: `${testEmployee.firstName} ${testEmployee.lastName}`,
          email: testEmployee.email,
          position: testEmployee.position,
          department: testEmployee.department
        },
        timestamp: new Date()
      }],
      `Added employee: ${testEmployee.firstName} ${testEmployee.lastName} (${testEmployee.email})`
    );
    console.log('Employee addition logged successfully');
    
    // Test 3: Retrieve audit history
    console.log('Retrieving audit history...');
    const auditHistory = await auditService.getCompanyChangeHistory(company._id);
    console.log('Audit history:', JSON.stringify(auditHistory, null, 2));
    
    // Test 4: Check if employee addition is in audit
    const employeeAddition = auditHistory.find(log => log.action === 'add_employee');
    if (employeeAddition) {
      console.log('✅ SUCCESS: Employee addition found in audit trail');
      console.log('Action:', employeeAddition.action);
      console.log('Description:', employeeAddition.description);
      console.log('User:', employeeAddition.userName);
      console.log('Changes:', employeeAddition.changes);
    } else {
      console.log('❌ FAILURE: Employee addition not found in audit trail');
    }
    
    // Cleanup
    await Company.deleteOne({ _id: company._id });
    console.log('Test company cleaned up');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Connect to database and run test
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/global-tracker')
  .then(() => {
    console.log('Connected to database');
    testAuditLogging();
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });
