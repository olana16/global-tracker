require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

// ❌ Do NOT allow importing
if (require.main !== module) {
  throw new Error('This script must be run directly');
}

// ❌ Block production unless allowed
if (
  process.env.NODE_ENV === 'production' &&
  process.env.DEV_UTILS_ALLOWED !== 'true'
) {
  console.error('Admin creation blocked');
  process.exit(1);
}

const {
  MONGODB_URI,
  BOOTSTRAP_ADMIN_EMAIL,
  BOOTSTRAP_ADMIN_PASSWORD
} = process.env;

if (!BOOTSTRAP_ADMIN_EMAIL || !BOOTSTRAP_ADMIN_PASSWORD) {
  console.error('Missing admin credentials in .env');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const exists = await User.findOne({ email: BOOTSTRAP_ADMIN_EMAIL });
    if (exists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      firstName: 'System',
      lastName: 'Administrator',
      email: BOOTSTRAP_ADMIN_EMAIL,
      password: BOOTSTRAP_ADMIN_PASSWORD, // ✅ PLAIN TEXT
      role: 'admin'
    });

    console.log('Admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
