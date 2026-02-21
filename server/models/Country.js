const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        minlength: 2,
        maxlength: 3
    },
    region: {
        type: String,
        trim: true
    },
    continent: {
        type: String,
        trim: true
    },
    capital: {
        type: String,
        trim: true
    },
    population: {
        type: Number,
        min: 0
    },
    currency: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
countrySchema.index({ name: 1 });
countrySchema.index({ code: 1 });

// Virtual for company count
countrySchema.virtual('companyCount', {
    ref: 'Company',
    localField: 'name',
    foreignField: 'country',
    count: true
});

// Virtual for person count
countrySchema.virtual('personCount', {
    ref: 'Person',
    localField: 'name',
    foreignField: 'country',
    count: true
});

// Set JSON options to include virtuals
countrySchema.set('toJSON', { virtuals: true });
countrySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Country', countrySchema);
