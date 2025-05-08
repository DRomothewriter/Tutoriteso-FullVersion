const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getUsers = async (req, res) => {
    const users = await Usuario.find();
    res.json(users);
};

// Obtener información del usuario
exports.getUserById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);  // Obtener el usuario autenticado
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar usuario (nombre, correo electrónico, etc.)
exports.updateUser = async (req, res) => {
    try {
        const user = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User no found.' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.usuario.id);  // Eliminar el usuario autenticado
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
