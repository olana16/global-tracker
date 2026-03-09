# Audit Trail Troubleshooting Guide

## Issue: "No detailed changes found for this company"

### Possible Causes and Solutions

## 1. **Database Connection Issues**

### Check Database Connection
```bash
# Run the test script to verify database connection
cd /home/operator12/Music/Glob
node test-audit.js
```

### Expected Output:
```
Connected to MongoDB
Found X audit logs in database
Found Y companies
```

### If Connection Fails:
- Check MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env` file
- Verify database name: `global_tracking`

## 2. **API Endpoint Issues**

### Check Server Routes
The audit endpoints should be available at:
- `GET /api/v1/companies/:id/audit` - Get history for one company
- `GET /api/v1/companies/audit/all` - Get all changes

### Test API Directly:
```bash
# Test the audit endpoint (replace COMPANY_ID with actual ID)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/v1/companies/COMPANY_ID/audit
```

## 3. **Frontend API Call Issues**

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Expand company in audit trail
4. Look for the audit API call
5. Check response status and data

### Expected API Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "audit_log_id",
      "company": "company_id",
      "user": "user_id",
      "userName": "John Smith",
      "userRole": "pentester",
      "action": "add_ip",
      "changes": [
        {
          "field": "ipAddresses",
          "newValue": "192.168.1.100",
          "timestamp": "2024-03-09T..."
        }
      ],
      "timestamp": "2024-03-09T...",
      "description": "Added IP address: 192.168.1.100"
    }
  ]
}
```

## 4. **Server Logging Issues**

### Check Server Console
```bash
# Check server logs for audit-related messages
cd /home/operator12/Music/Glob/server
npm start
```

### Look for These Messages:
- `=== LOGGING IP ADDRESS CHANGE ===`
- `=== GETTING COMPANY CHANGE HISTORY ===`
- `IP change log saved successfully:`
- `Found X change logs for company COMPANY_ID`

### If No Debug Messages:
- Verify auditService is imported in companyController.js
- Check if logIpAddressChange is being called
- Verify CompanyChangeLog model is imported

## 5. **Permission Issues**

### Check Access Control
Verify the middleware allows pentesters to modify companies:

```javascript
// In companyAccess.js, ensure this logic exists:
const isAssigned = assignedCompanyIds.some(assignedId => 
  assignedId.toString() === companyId.toString()
);
```

### Test Pentester Access:
1. Log in as a pentester
2. Try to add IP address to assigned company
3. Check server console for audit logging

## 6. **Database Collection Issues**

### Check MongoDB Collections
```javascript
// Connect to MongoDB and check collections
use global_tracking
show collections

// Should see:
// - companies
// - companychangelogs  (new collection)
// - users
// - etc.
```

### Check Audit Collection Structure:
```javascript
db.companychangelogs.findOne()
// Should return document with fields:
// - company, user, userName, userRole, action, changes, timestamp, description
```

## 7. **Step-by-Step Debug Process**

### Step 1: Verify Basic Functionality
1. Start server: `cd server && npm start`
2. Add IP address via Companies page (as pentester)
3. Check server console for debug messages
4. Check MongoDB for new audit log entry

### Step 2: Test Audit API
1. Get company ID from database
2. Test endpoint: `http://localhost:5000/api/v1/companies/COMPANY_ID/audit`
3. Verify response contains audit data

### Step 3: Test Frontend
1. Go to Audit Trail page (as admin)
2. Expand company row
3. Check browser Network tab for API call
4. Verify response data structure

## 8. **Common Fixes**

### Fix 1: Missing Model Import
```javascript
// Ensure this is in companyController.js:
const auditService = require('../services/auditService');
```

### Fix 2: Route Not Mounted
```javascript
// Ensure these routes are in companyRoutes.js:
router.get('/:id/audit', protect, authorize('admin'), async (req, res) => {
  // ... audit endpoint code
});
```

### Fix 3: Database Index Issues
```javascript
// Add indexes to CompanyChangeLog model for performance:
companyChangeLogSchema.index({ company: 1, timestamp: -1 });
```

### Fix 4: API URL Mismatch
```javascript
// Ensure frontend uses correct API base URL:
const API_BASE_URL = 'http://localhost:5000/api/v1'
```

## 9. **Quick Test Script**

Create this test file to verify everything works:
```javascript
// test-complete-flow.js
const axios = require('axios');

async function testCompleteFlow() {
  try {
    // Step 1: Login as pentester
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'pentester@test.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    
    // Step 2: Add IP address
    const ipResponse = await axios.post(
      'http://localhost:5000/api/v1/companies/COMPANY_ID/ips',
      { ipAddress: '192.168.1.999' },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    console.log('IP added:', ipResponse.data);
    
    // Step 3: Check audit log
    const auditResponse = await axios.get(
      'http://localhost:5000/api/v1/companies/COMPANY_ID/audit',
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    console.log('Audit data:', auditResponse.data);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testCompleteFlow();
```

## 10. **If All Else Fails**

### Manual Database Check:
```javascript
// Direct MongoDB check
mongo global_tracking
db.companychangelogs.find({}).sort({timestamp: -1}).limit(5)
```

### Restart Everything:
```bash
# Stop server (Ctrl+C)
# Clear any cached data
rm -rf node_modules/.cache
# Restart MongoDB
sudo systemctl restart mongod
# Restart server
cd server && npm start
```

This guide should help identify why the audit trail is not showing detailed changes. The most common issues are:
1. Database connection problems
2. Missing route mounting
3. Frontend API URL mismatches
4. Permission middleware blocking access
5. Model import issues
