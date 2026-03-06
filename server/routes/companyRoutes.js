const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const companyController = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
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

// Update a company
router.put(
  '/:id',
  protect,
  authorize('admin'),
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

// Add IP address to company (admin and pentester)
router.post('/:id/ips', protect, authorize('admin', 'pentester'), companyController.addIpAddress);

// Remove IP address from company (admin and pentester)
router.delete('/:id/ips/:ip', protect, authorize('admin', 'pentester'), companyController.removeIpAddress);

// Add subdomain to company (admin and pentester)
router.post('/:id/subdomains', protect, authorize('admin', 'pentester'), companyController.addSubdomain);

// Remove subdomain from company (admin and pentester)
router.delete('/:id/subdomains/:subdomain', protect, authorize('admin', 'pentester'), companyController.removeSubdomain);

module.exports = router;
