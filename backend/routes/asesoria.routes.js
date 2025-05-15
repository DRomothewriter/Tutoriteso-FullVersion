const express = require('express');
const router = express.Router();
const asesoriaController = require('../controllers/asesoria.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/UserAuth');
const { inscribirseAsesoria } = require('../controllers/asesoria.controller');

// Rutas de Asesorías
router.post('/', authMiddleware, asesoriaController.createAsesoria);
router.get('/mis-asesorias', authMiddleware, asesoriaController.getAsesoriasByAsesor);
router.get('/', asesoriaController.getAsesorias);

router.post('/:id/inscribirse', authMiddleware, inscribirseAsesoria);

router.get('/:id', asesoriaController.getAsesoriaById);
router.put('/:id', authMiddleware, asesoriaController.updateAsesoria);
router.delete('/:id', authMiddleware, asesoriaController.deleteAsesoria);

module.exports = router;
