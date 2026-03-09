const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const companyController = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { checkCompanyUpdateAccess, checkCompanyTechnicalAccess } = require('../middleware/companyAccess');
const auditService = require('../services/auditService');
const rateLimit = require('express-rate-limit');

const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many export requests from this IP, please try again later.'
});

// Get all companies
router.get('/', protect, companyController.getCompanies);

// Get a single company by ID
router.get('/:id', protect, companyController.getCompany);

// Create a new company
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    check('name', 'Company name is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty()
  ],
  companyController.createCompany
);

// Update a company (admin or assigned pentester)
router.put(
  '/:id',
  protect,
  checkCompanyUpdateAccess,
  [
    check('name', 'Company name is required').optional().not().isEmpty(),
    check('country', 'Country is required').optional().not().isEmpty()
  ],
  companyController.updateCompany
);

// Delete a company
router.delete('/:id', protect, authorize('admin'), companyController.deleteCompany);

// Export company people (admin only)
router.get('/:id/export', protect, authorize('admin'), exportLimiter, companyController.exportPeople);

// Get people by company
router.get('/:id/people', companyController.getCompanyPeople);

// Add IP address to company (admin or assigned pentester)
router.post('/:id/ips', protect, checkCompanyTechnicalAccess, companyController.addIpAddress);

// Remove IP address from company (admin or assigned pentester)
router.delete('/:id/ips/:ip', protect, checkCompanyTechnicalAccess, companyController.removeIpAddress);

// Add subdomain to company (admin or assigned pentester)
router.post('/:id/subdomains', protect, checkCompanyTechnicalAccess, companyController.addSubdomain);

// Remove subdomain from company (admin or assigned pentester)
router.delete('/:id/subdomains/:subdomain', protect, checkCompanyTechnicalAccess, companyController.removeSubdomain);

// Get detailed audit history for a specific company
router.get('/:id/audit', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    
    const changeHistory = await auditService.getCompanyChangeHistory(id, parseInt(limit));
    
    res.json({
      success: true,
      data: changeHistory
    });
  } catch (error) {
    console.error('Error fetching company audit history:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all company changes (admin only)
router.get('/audit/all', protect, authorize('admin'), async (req, res) => {
  try {
    const filters = {
      companyId: req.query.companyId,
      userId: req.query.userId,
      action: req.query.action,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };
    
    const allChanges = await auditService.getAllCompanyChanges(filters);
    
    res.json({
      success: true,
      ...allChanges
    });
  } catch (error) {
    console.error('Error fetching all company changes:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
