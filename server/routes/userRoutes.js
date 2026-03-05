const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateProfile,
  assignCompanies,
  updatePermissions,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, getUsers);

// Get user by ID (Admin or assigned Pentester)
router.get('/:id', protect, getUserById);

// Create new user (Admin only)
router.post('/', protect, createUser);

// Update user profile (Self only)
router.put('/profile', protect, updateProfile);

// Update user (Admin only)
router.put('/:id', protect, updateUser);

// Assign companies to pentester (Admin only)
router.put('/:id/assign-companies', protect, assignCompanies);

// Update user permissions (Admin only)
router.put('/:id/permissions', protect, updatePermissions);

// Delete user (Admin only)
router.delete('/:id', protect, deleteUser);

module.exports = router;
