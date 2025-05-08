const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materia.controller');

// Rutas de Materias
router.post('/', materiaController.createMateria);
router.get('/', materiaController.getMaterias);
router.get('/:id', materiaController.getMateriaById);
router.put('/:id', materiaController.updateMateria);
router.delete('/:id', materiaController.deleteMateria);

module.exports = router;
