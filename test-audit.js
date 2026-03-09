// Simple test script to verify audit logging is working
const mongoose = require('mongoose');
const Company = require('./server/models/Company');
const CompanyChangeLog = require('./server/models/CompanyChangeLog');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/global_tracking';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Test 1: Check if CompanyChangeLog collection exists and has data
        const allLogs = await CompanyChangeLog.find({});
        console.log(`Found ${allLogs.length} audit logs in database`);
        
        if (allLogs.length > 0) {
            console.log('Sample audit log:', JSON.stringify(allLogs[0], null, 2));
        }
        
        // Test 2: Check companies with audit info
        const companies = await Company.find({});
        console.log(`Found ${companies.length} companies`);
        
        companies.forEach(company => {
            console.log(`Company: ${company.name}, Last Updated By: ${company.lastUpdatedByName || 'Unknown'}`);
        });
        
        // Test 3: Create a test audit log entry
        const testLog = new CompanyChangeLog({
            company: companies[0]?._id,
            user: 'test-user-id',
            userName: 'Test User',
            userRole: 'pentester',
            action: 'add_ip',
            changes: [{
                field: 'ipAddresses',
                newValue: '192.168.1.999',
                timestamp: new Date()
            }],
            description: 'Test IP addition'
        });
        
        await testLog.save();
        console.log('Created test audit log entry');
        
        // Test 4: Retrieve the test entry
        const testLogs = await CompanyChangeLog.find({ userName: 'Test User' });
        console.log(`Found ${testLogs.length} test logs`);
        
    } catch (error) {
        console.error('Test error:', error);
    }
    
    process.exit(0);
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
