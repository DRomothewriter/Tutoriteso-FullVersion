const express = require('express');
const router = express.Router();
const postForoController = require('../controllers/postForo.controller');
const authMiddleware = require('../middleware/auth');  // Asumimos que existe un middleware de autenticación

// Rutas de PostForo
router.post('/', authMiddleware, postForoController.createPost);
router.get('/', postForoController.getPosts);
router.get('/:id', postForoController.getPostById);
router.put('/:id', authMiddleware, postForoController.updatePost);
router.delete('/:id', authMiddleware, postForoController.deletePost);

module.exports = router;
