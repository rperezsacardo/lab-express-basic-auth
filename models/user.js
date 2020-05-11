// User model goes here
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nick: String,
  name: {
    type: String,
    required: true, // Now it's case sensitivity, I need chnege this.
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
