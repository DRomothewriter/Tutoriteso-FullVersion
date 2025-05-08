const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{type: String, required: true} ,
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: {type: String, required: true},
    stock: { type: Number, required: true, default: 0 },
    category:{type: String, required: true, default: "Sin categoría"},
    sku: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
