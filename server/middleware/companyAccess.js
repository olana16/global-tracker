const Company = require('../models/Company');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Check if user has access to update a specific company
exports.checkCompanyUpdateAccess = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const user = req.user;

    // Admins can update any company
    if (user.role === 'admin') {
      return next();
    }

    // Pentesters can only update companies assigned to them
    if (user.role === 'pentester') {
      const company = await Company.findById(companyId);
      
      if (!company) {
        return next(new ErrorResponse('Company not found', 404));
      }

      // Check if this pentester is assigned to this company
      const userDoc = await User.findById(user._id);
      const assignedCompanyIds = userDoc.assignedCompanies || [];
      const isAssigned = assignedCompanyIds.some(assignedId => 
        assignedId.toString() === companyId.toString()
      );

      if (!isAssigned) {
        return next(new ErrorResponse('Access denied - Company not assigned to this pentester', 403));
      }

      return next();
    }

    // Regular users cannot update companies
    return next(new ErrorResponse('Access denied - Insufficient permissions', 403));
  } catch (error) {
    console.error('Error checking company update access:', error);
    return next(new ErrorResponse('Server error', 500));
  }
};

// Check if user has access to add/remove IP addresses or subdomains
exports.checkCompanyTechnicalAccess = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const user = req.user;

    // Admins can modify any company
    if (user.role === 'admin') {
      return next();
    }

    // Pentesters can only modify companies assigned to them
    if (user.role === 'pentester') {
      const company = await Company.findById(companyId);
      
      if (!company) {
        return next(new ErrorResponse('Company not found', 404));
      }

      // Check if this pentester is assigned to this company
      const userDoc = await User.findById(user._id);
      const assignedCompanyIds = userDoc.assignedCompanies || [];
      const isAssigned = assignedCompanyIds.some(assignedId => 
        assignedId.toString() === companyId.toString()
      );

      if (!isAssigned) {
        return next(new ErrorResponse('Access denied - Company not assigned to this pentester', 403));
      }

      return next();
    }

    // Regular users cannot modify companies
    return next(new ErrorResponse('Access denied - Insufficient permissions', 403));
  } catch (error) {
    console.error('Error checking company technical access:', error);
    return next(new ErrorResponse('Server error', 500));
  }
};
