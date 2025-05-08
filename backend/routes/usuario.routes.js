const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middleware/auth');  // Asumimos que existe un middleware de autenticación

// Rutas de usuario
router.post('/', usuarioController.register);
router.post('/login', usuarioController.login);

// Ruta para obtener la información del usuario
router.get('/', authMiddleware, usuarioController.getUsers);
router.get('/:id', authMiddleware, usuarioController.getUserById);
// Ruta para actualizar los detalles del usuario (nombre, email, password, etc.)
router.put('/:id', authMiddleware, usuarioController.updateUser);

// Ruta para eliminar el usuario
router.delete('/:id', authMiddleware, usuarioController.deleteUser);

module.exports = router;
