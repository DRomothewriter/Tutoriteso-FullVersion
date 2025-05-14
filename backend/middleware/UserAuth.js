const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  // Leer el token desde la cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Se requiere autenticación.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(400).json({ message: 'Token inválido: userId no definido' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = { userId: user._id, role: user.role };
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No autorizado. Solo admins pueden realizar esta acción.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
