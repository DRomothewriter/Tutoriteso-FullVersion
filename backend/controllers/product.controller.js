const Product = require('../models/product.model');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Products INDEX
exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'product no found.' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product no found.' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE Product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product no found.' });
        res.json({ message: 'Product was deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

