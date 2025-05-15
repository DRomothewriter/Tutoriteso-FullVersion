const { urlencoded } = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materiaSchema = new mongoose.Schema({
    name:{type: String, required: true} ,
    description: { type: String, required: true },
    category:{type: String, required: true, },
    url:{type: String, required: true}
});

module.exports = mongoose.model('Materia', materiaSchema);