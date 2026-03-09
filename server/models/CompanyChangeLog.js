const mongoose = require('mongoose');

const companyChangeLogSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userRole: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'add_ip', 'remove_ip', 'add_subdomain', 'remove_subdomain', 'add_employee', 'remove_employee']
  },
  changes: [{
    field: {
      type: String,
      required: true
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
companyChangeLogSchema.index({ company: 1, timestamp: -1 });
companyChangeLogSchema.index({ user: 1, timestamp: -1 });
companyChangeLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('CompanyChangeLog', companyChangeLogSchema);
