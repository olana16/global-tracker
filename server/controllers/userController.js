const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const Company = require('../models/Company');
const Activity = require('../models/Activity');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const users = await User.find({})
    .select('-password')
    .populate('assignedCompanies', 'name industry country')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: users });
});

// @desc    Get user by ID (Admin or assigned Pentester)
// @route   GET /api/users/:id
// @access  Private/Admin/Pentester
exports.getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const requestingUser = req.user;

  // Admin can access any user
  if (requestingUser.role === 'admin') {
    const user = await User.findById(id)
      .select('-password')
      .populate('assignedCompanies', 'name industry country');
      
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  }

  // Pentester can only access themselves
  if (requestingUser.role === 'pentester' && requestingUser._id.toString() !== id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const user = await User.findById(id)
    .select('-password')
    .populate('assignedCompanies', 'name industry country');
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Check if pentester is trying to access another pentester's data
  if (requestingUser.role === 'pentester' && user.role === 'pentester' && requestingUser._id.toString() !== id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  console.log('Admin createUser request received') // Debug log
  console.log('Request body:', req.body) // Debug log
  console.log('Request files:', req.files) // Debug log

  // Handle both FormData and JSON requests
  let firstName, lastName, email, password, role, permissions;
  
  if (req.body instanceof FormData) {
    // FormData request (with photo)
    firstName = req.body.get('firstName');
    lastName = req.body.get('lastName');
    email = req.body.get('email');
    password = req.body.get('password');
    role = req.body.get('role');
    permissions = req.body.get('permissions');
  } else {
    // JSON request (without photo)
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    email = req.body.email;
    password = req.body.password;
    role = req.body.role;
    permissions = req.body.permissions;
  }

  console.log('Extracted user data:', { firstName, lastName, email, role }) // Debug log

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide all required fields' 
    });
  }

  // Validate role
  if (!['user', 'admin', 'pentester'].includes(role)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid role specified' 
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: 'User with this email already exists' 
    });
  }

  // Handle photo upload
  let photoPath = 'no-photo.jpg';
  
  if (req.files && req.files.photo) {
    const photo = req.files.photo;
    
    console.log('Photo file received for user creation:', photo.name) // Debug log
    
    // Validate file type
    if (!photo.mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    
    // Validate file size (max 5MB)
    if (photo.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Photo size should be less than 5MB' });
    }
    
    // Generate unique filename
    photo.name = `user_${Date.now()}_${photo.name.replace(/\s+/g, '_')}`;
    
    console.log('Generated photo filename:', photo.name) // Debug log
    
    // Move file to upload directory synchronously
    try {
      await new Promise((resolve, reject) => {
        photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, (err) => {
          if (err) {
            console.error('File upload error:', err);
            reject(err);
          } else {
            console.log('Photo uploaded successfully for user creation:', photo.name) // Debug log
            resolve();
          }
        });
      });
      
      photoPath = photo.name;
      console.log('Photo path set to:', photoPath) // Debug log
      
    } catch (uploadError) {
      console.error('Photo upload failed:', uploadError);
      return res.status(500).json({ success: false, message: 'Problem with file upload' });
    }
  }

  // Create user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    role: role || 'user',
    permissions: permissions || 'read',
    photo: photoPath
  });

  await user.save();

  console.log('User created successfully:', user._id);
  console.log('User photo:', user.photo);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({ success: true, data: userResponse });
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const { id } = req.params;
  const updates = req.body;

  // Don't allow role changes through this endpoint (use dedicated role change endpoint)
  delete updates.role;
  delete updates.password;

  const user = await User.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).select('-password').populate('assignedCompanies', 'name industry country');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Update user profile (Self only)
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  console.log('Profile update request received') // Debug log
  console.log('Request body keys:', Object.keys(req.body)) // Debug log
  console.log('Request body:', req.body) // Debug log
  console.log('Request files exist:', !!req.files) // Debug log
  console.log('Request files:', req.files) // Debug log
  console.log('Request user:', req.user) // Debug log
  
  const { firstName, lastName, currentPassword, newPassword } = req.body;
  const userId = req.user._id;
  
  console.log('Profile update request for user:', userId) // Debug log
  console.log('Update data:', { firstName, lastName, hasNewPassword: !!newPassword }) // Debug log

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId) // Debug log
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Handle photo upload
    if (req.files && req.files.photo) {
      const photo = req.files.photo;
      
      console.log('Photo file received for update:', photo.name) // Debug log
      console.log('Photo file type:', photo.mimetype) // Debug log
      console.log('Photo file size:', photo.size) // Debug log
      
      // Validate file type
      if (!photo.mimetype.startsWith('image/')) {
        return res.status(400).json({ success: false, message: 'Please upload an image file' });
      }
      
      // Validate file size (max 5MB)
      if (photo.size > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'Photo size should be less than 5MB' });
      }
      
      // Generate unique filename
      photo.name = `user_${userId}_${Date.now()}_${photo.name.replace(/\s+/g, '_')}`;
      
      console.log('Generated photo filename:', photo.name) // Debug log
      
      // Move file to upload directory synchronously
      try {
        await new Promise((resolve, reject) => {
          photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, (err) => {
            if (err) {
              console.error('File upload error:', err);
              reject(err);
            } else {
              console.log('Photo uploaded successfully for update:', photo.name) // Debug log
              resolve();
            }
          });
        });
        
        // Update user with new photo
        user.photo = photo.name;
        console.log('User photo field updated to:', user.photo) // Debug log
        
      } catch (uploadError) {
        console.error('Photo upload failed:', uploadError);
        return res.status(500).json({ success: false, message: 'Problem with file upload' });
      }
    } else {
      console.log('No photo file received in request') // Debug log
      console.log('req.files is:', req.files) // Debug log
      console.log('req.files.photo is:', req.files?.photo) // Debug log
    }

    // Update basic info
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Handle password update if provided
    if (newPassword) {
      if (!currentPassword) {
        console.log('Current password missing') // Debug log
        return res.status(400).json({ success: false, message: 'Current password is required to set new password' });
      }

      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        console.log('Current password incorrect') // Debug log
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      // Set new password
      user.password = newPassword;
    }

    // Save the updated user
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    
    console.log('Profile updated successfully for user:', userId) // Debug log
    console.log('Updated user photo:', updatedUser.photo) // Debug log
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Assign companies to pentester (Admin only)
// @route   PUT /api/users/:id/assign-companies
// @access  Private/Admin
exports.assignCompanies = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const { id } = req.params;
  const { companyIds } = req.body;

  if (!id || !companyIds || !Array.isArray(companyIds)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide user ID and company IDs array' 
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { assignedCompanies: companyIds },
    { new: true }
  ).populate('assignedCompanies', 'name industry country');

  res.status(200).json({ success: true, data: user, message: 'Companies assigned successfully' });
});

// @desc    Update user permissions (Admin only)
// @route   PUT /api/users/:id/permissions
// @access  Private/Admin
exports.updatePermissions = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const { userId, permissions } = req.body;

  if (!userId || !permissions) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide user ID and permissions' 
    });
  }

  if (!['read', 'read_write', 'full_access'].includes(permissions)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid permissions specified' 
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { permissions },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user, message: 'Permissions updated successfully' });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, message: 'User deleted successfully' });
});
