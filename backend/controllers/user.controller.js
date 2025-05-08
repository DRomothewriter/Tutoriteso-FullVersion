const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Create User
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// USERS INDEX
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User no found.' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User no found.' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User no found.' });
        res.json({ message: 'User was deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        res.json({ token }); 
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
