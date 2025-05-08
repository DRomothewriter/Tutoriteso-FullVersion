const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario.controller');
const authMiddleware = require('../middleware/auth');  // Asumimos que existe un middleware de autenticación

// Rutas de Comentarios
router.post('/', authMiddleware, comentarioController.createComentario);
router.get('/:postId', comentarioController.getComentariosByPost);

module.exports = router;
