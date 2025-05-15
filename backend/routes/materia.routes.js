const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materia.controller');

/**
 * @swagger
 * tags:
 *   name: Materias
 *   description: Rutas para gestionar materias
 */

/**
 * @swagger
 * /api/materias:
 *   post:
 *     summary: Crear una nueva materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Materia creada exitosamente.
 *       400:
 *         description: Petición inválida.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', materiaController.createMateria);

/**
 * @swagger
 * /api/materias:
 *   get:
 *     summary: Obtener todas las materias
 *     tags: [Materias]
 *     responses:
 *       200:
 *         description: Lista de materias obtenida exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', materiaController.getMaterias);

/**
 * @swagger
 * /api/materias/{id}:
 *   get:
 *     summary: Obtener una materia por ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Materia encontrada exitosamente.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', materiaController.getMateriaById);

/**
 * @swagger
 * /api/materias/{id}:
 *   put:
 *     summary: Actualizar una materia existente
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Materia actualizada exitosamente.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', materiaController.updateMateria);

/**
 * @swagger
 * /api/materias/{id}:
 *   delete:
 *     summary: Eliminar una materia por ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Materia eliminada exitosamente.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', materiaController.deleteMateria);

module.exports = router;
