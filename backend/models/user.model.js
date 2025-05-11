const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  materias:[{type: Schema.Types.ObjectId, ref: 'Materia'}] 
});

const User = mongoose.model('User', userSchema);
module.exports = User;
