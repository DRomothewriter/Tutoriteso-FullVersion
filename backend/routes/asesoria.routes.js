const express = require('express');
const router = express.Router();
const asesoriaController = require('../controllers/asesoria.controller');
const authMiddleware = require('../middleware/auth');  // Asumimos que existe un middleware de autenticación

// Rutas de Asesorías
router.post('/', authMiddleware, asesoriaController.createAsesoria);
router.get('/', asesoriaController.getAsesorias);
router.get('/:id', asesoriaController.getAsesoriaById);
router.put('/:id', authMiddleware, asesoriaController.updateAsesoria);
router.delete('/:id', authMiddleware, asesoriaController.deleteAsesoria);

module.exports = router;
