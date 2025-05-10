const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  // Obtener el token del header 'Authorization'
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Se requiere autenticacion' });
  }

  try {
    // Verificar el token y obtener el payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(400).json({ message: 'Token inválido: userId no definido' });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asignar el usuario autenticado a req.user
    req.user = { userId: user._id, role: user.role };

    next(); // Permitir acceso a cualquier usuario autenticado
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Middleware para restringir acceso solo a administradores
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No autorizado. Solo admins pueden realizar esta accion.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };