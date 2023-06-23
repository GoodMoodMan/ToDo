const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
  
  id: { type: String, required: true },
  content: { type: String, required: false },
  date: { type: String, required: false }, 
  // Additional task properties...
});

// Define the user schema
const userSchema = new mongoose.Schema({
  
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: {type: String, required: true},
  tasks: [taskSchema], // Array of task objects
  // Additional user properties...
});

// Create the User model using the user schema
const User = mongoose.model('User', userSchema);

module.exports = User;