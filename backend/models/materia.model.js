const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
    name:{type: String, required: true} ,
    description: { type: String, required: true },
    category:{type: String, required: true, },
});

module.exports = mongoose.model('Materia', materiaSchema);