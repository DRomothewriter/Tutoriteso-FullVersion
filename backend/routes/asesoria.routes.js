const express = require('express');
const router = express.Router();
const asesoriaController = require('../controllers/asesoria.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/UserAuth');
const { inscribirseAsesoria } = require('../controllers/asesoria.controller');

/**
 * @swagger
 * tags:
 *   name: Asesorias
 *   description: Rutas para gestionar asesorías
 */

/**
 * @swagger
 * /api/asesorias:
 *   post:
 *     summary: Crear una nueva asesoría
 *     tags: [Asesorias]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - materia
 *               - plataforma
 *               - sesiones
 *             properties:
 *               materia:
 *                 type: string
 *               plataforma:
 *                 type: string
 *               plataformaPersonalizada:
 *                 type: string
 *               sesiones:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *               duracion:
 *                 type: number
 *     responses:
 *       201:
 *         description: Asesoría creada exitosamente.
 *       400:
 *         description: Petición inválida.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', authMiddleware, asesoriaController.createAsesoria);

/**
 * @swagger
 * /api/asesorias/mis-asesorias:
 *   get:
 *     summary: Obtener asesorías del asesor autenticado
 *     tags: [Asesorias]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asesorías obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/mis-asesorias', authMiddleware, asesoriaController.getAsesoriasByAsesor);

/**
 * @swagger
 * /api/asesorias:
 *   get:
 *     summary: Obtener todas las asesorías
 *     tags: [Asesorias]
 *     responses:
 *       200:
 *         description: Lista de asesorías obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', asesoriaController.getAsesorias);

/**
 * @swagger
 * /api/asesorias/{id}/inscribirse:
 *   post:
 *     summary: Inscribir al usuario autenticado en la asesoría
 *     tags: [Asesorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asesoría
 *     responses:
 *       200:
 *         description: Inscripción exitosa.
 *       400:
 *         description: Ya inscrito o sin sesiones futuras.
 *       404:
 *         description: Asesoría no encontrada.
 *       500:
 *         description: Error interno.
 */
router.post('/:id/inscribirse', authMiddleware, inscribirseAsesoria);

/**
 * @swagger
 * /api/asesorias/{id}/cancelar-inscripcion:
 *   post:
 *     summary: Cancelar inscripción del usuario autenticado
 *     tags: [Asesorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asesoría
 *     responses:
 *       200:
 *         description: Inscripción cancelada correctamente.
 *       400:
 *         description: Usuario no estaba inscrito.
 *       404:
 *         description: Asesoría no encontrada.
 *       500:
 *         description: Error interno.
 */
router.post('/:id/cancelar-inscripcion', authMiddleware, asesoriaController.cancelarInscripcion);

/**
 * @swagger
 * /api/asesorias/{id}:
 *   get:
 *     summary: Obtener asesoría por ID
 *     tags: [Asesorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asesoría
 *     responses:
 *       200:
 *         description: Asesoría encontrada exitosamente.
 *       404:
 *         description: Asesoría no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', asesoriaController.getAsesoriaById);

/**
 * @swagger
 * /api/asesorias/{id}:
 *   put:
 *     summary: Actualizar asesoría
 *     tags: [Asesorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asesoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materia:
 *                 type: string
 *               sesiones:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Asesoría actualizada.
 *       404:
 *         description: Asesoría no encontrada.
 *       500:
 *         description: Error interno.
 */
router.put('/:id', authMiddleware, asesoriaController.updateAsesoria);

/**
 * @swagger
 * /api/asesorias/{id}:
 *   delete:
 *     summary: Eliminar asesoría
 *     tags: [Asesorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asesoría
 *     responses:
 *       200:
 *         description: Asesoría eliminada exitosamente.
 *       404:
 *         description: Asesoría no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', authMiddleware, asesoriaController.deleteAsesoria);

module.exports = router;
