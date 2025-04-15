const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Update all users to have full access
    const result = await User.updateMany(
      {}, // match all users
      { $set: { role: 'user' } } // set role to 'user'
    );

    console.log(`Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateUsers(); 