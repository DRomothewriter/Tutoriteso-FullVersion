const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'asesor', 'asesorado'], 
    default: 'asesorado'
  },
  materias: {
    type: [String], 
    default: undefined 
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
