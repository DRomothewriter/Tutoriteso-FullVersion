const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Función de login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Correo electronico o contrasenia incorrectos' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo electronico o contrasenia incorrectos' });
    }

    // Generar el JWT con el id del usuario y el rol
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar el token como una cookie httpOnly
    res.cookie('token', token, {
      httpOnly: false,      // Solo accesible desde el servidor, no en JS del frontend
      secure: process.env.NODE_ENV === 'production', // Asegura la cookie solo en HTTPS
      maxAge: 3600000,     // 1 hora en milisegundos
      sameSite: 'Strict',  // Previene CSRF
    });

    // Enviar respuesta
    res.json({ message: 'Log in exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };
