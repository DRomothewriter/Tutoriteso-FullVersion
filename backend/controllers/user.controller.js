const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const validator = require('validator');  

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Datos recibidos del cliente:");
    console.log("Nombre:", name);
    console.log("Email:", email);
    console.log("Contraseña:", password);
    console.log("Rol:", role);

    // Verificar si el correo tiene un formato válido
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'El formato del correo electrónico es incorrecto' });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña antes de guardar el usuario
    const salt = await bcrypt.genSalt(10); // Generar el salt
    const hashedPassword = await bcrypt.hash(password, salt); // Encriptar la contraseña

    // Crear un nuevo usuario con la contraseña encriptada
    const newUser = new User({ name, email, password: hashedPassword, role });
    
    // Guardar el nuevo usuario
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);  
    res.status(500).json({ message: 'Error al crear el usuario. Inténtalo nuevamente' });
  }
};

// Autenticación (Login) - Retorna JWT
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseñas
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const jwtSecret = process.env.JWT_SECRET;
    console.log("Secreto JWT:", jwtSecret); // Para depuración
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todos los usuarios (solo admin)
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accion no permitida, solo los administradores pueden obtener todos los usuarios.' });
    }

    const users = await User.find().select('-password'); // No incluir la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID (admin o dueño)

const getUserById = async (req, res) => {
  try {
   // console.log("ID del usuario autenticado (req.user.userId):", req.user.userId);  
    //console.log("ID del usuario solicitado desde la URL (req.params.id):", req.params.id);

    // Convertir ambos ID a string
    const userIdFromParams = req.params.id.toString();
    const userIdFromAuth = req.user.userId.toString();

    const user = await User.findById(req.params.id).select('-password'); // No incluir la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario es admin o dueño del perfil solicitado
    if (req.user.role !== 'admin' && userIdFromParams !== userIdFromAuth) {
      //console.log("Acceso denegado: El usuario no es admin y no tiene permiso para ver este perfil.");
      return res.status(403).json({ message: 'No tienes permiso para ver este usuario' });
    }

    // Si todo está bien, responder con los datos del usuario
   // console.log("Acceso permitido: El usuario tiene permiso para ver este perfil.");
    res.json(user);

  } catch (error) {
    console.error("Error al obtener el usuario:", error.message);
    res.status(500).json({ message: error.message });
  }
};



// Actualizar un usuario por ID (admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;

    // Verificar si el usuario es admin o dueño del perfil
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este usuario' });
    }

    // Obtener el usuario antes de actualizar
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let hashedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password: hashedPassword, role },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un usuario por ID (solo admin)
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accion no permitida, solo los administradores pueden eliminar usuarios' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
