const CompanyChangeLog = require('../models/CompanyChangeLog');
const Company = require('../models/Company');

const logCompanyChange = async (companyId, userId, userName, userRole, action, changes = [], description = '') => {
  try {
    const changeLog = new CompanyChangeLog({
      company: companyId,
      user: userId,
      userName: userName,
      userRole: userRole,
      action: action,
      changes: changes,
      description: description
    });

    await changeLog.save();
    console.log('Company change logged:', { companyId, userName, action, changes });
  } catch (error) {
    console.error('Error logging company change:', error);
  }
};

const logFieldChanges = async (companyId, userId, userName, userRole, oldData, newData, action = 'update') => {
  const changes = [];
  
  // Compare and track field changes
  const fieldsToTrack = ['name', 'country', 'industry', 'website', 'foundedYear', 'revenue', 'isActive'];
  
  fieldsToTrack.forEach(field => {
    if (oldData[field] !== newData[field]) {
      changes.push({
        field: field,
        oldValue: oldData[field],
        newValue: newData[field],
        timestamp: new Date()
      });
    }
  });

  if (changes.length > 0) {
    await logCompanyChange(companyId, userId, userName, userRole, action, changes, `Updated ${changes.map(c => c.field).join(', ')}`);
  }
};

const logIpAddressChange = async (companyId, userId, userName, userRole, ipAddress, action) => {
  try {
    console.log('=== LOGGING IP ADDRESS CHANGE ===');
    console.log('Company ID:', companyId);
    console.log('User:', userName, '(', userRole, ')');
    console.log('IP Address:', ipAddress);
    console.log('Action:', action);
    
    const changes = [{
      field: 'ipAddresses',
      newValue: ipAddress,
      timestamp: new Date()
    }];

    const description = action === 'add_ip' ? `Added IP address: ${ipAddress}` : `Removed IP address: ${ipAddress}`;
    
    const changeLog = new CompanyChangeLog({
      company: companyId,
      user: userId,
      userName: userName,
      userRole: userRole,
      action: action,
      changes: changes,
      description: description
    });

    const result = await changeLog.save();
    console.log('IP change log saved successfully:', result._id);
  } catch (error) {
    console.error('Error logging IP address change:', error);
  }
};

const logSubdomainChange = async (companyId, userId, userName, userRole, subdomain, action) => {
  const changes = [{
    field: 'subdomains',
    newValue: subdomain,
    timestamp: new Date()
  }];

  const description = action === 'add_subdomain' ? `Added subdomain: ${subdomain}` : `Removed subdomain: ${subdomain}`;
  await logCompanyChange(companyId, userId, userName, userRole, action, changes, description);
};

const getCompanyChangeHistory = async (companyId, limit = 50) => {
  try {
    console.log('=== GETTING COMPANY CHANGE HISTORY ===');
    console.log('Company ID:', companyId);
    console.log('Limit:', limit);
    
    const changeLogs = await CompanyChangeLog.find({ company: companyId })
      .populate('user', 'firstName lastName email')
      .populate('company', 'name')
      .sort({ timestamp: -1 })
      .limit(limit);

    console.log(`Found ${changeLogs.length} change logs for company ${companyId}`);
    if (changeLogs.length > 0) {
      console.log('First log:', JSON.stringify(changeLogs[0], null, 2));
    }

    return changeLogs;
  } catch (error) {
    console.error('Error fetching company change history:', error);
    return [];
  }
};

const getAllCompanyChanges = async (filters = {}) => {
  try {
    const { companyId, userId, action, startDate, endDate, page = 1, limit = 20 } = filters;
    
    const query = {};
    
    if (companyId) query.company = companyId;
    if (userId) query.user = userId;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const changeLogs = await CompanyChangeLog.find(query)
      .populate('user', 'firstName lastName email')
      .populate('company', 'name country')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CompanyChangeLog.countDocuments(query);

    return {
      data: changeLogs,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit
      }
    };
  } catch (error) {
    console.error('Error fetching all company changes:', error);
    return { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, pageSize: limit } };
  }
};

module.exports = {
  logCompanyChange,
  logFieldChanges,
  logIpAddressChange,
  logSubdomainChange,
  getCompanyChangeHistory,
  getAllCompanyChanges
};
