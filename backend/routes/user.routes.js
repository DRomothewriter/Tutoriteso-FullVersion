const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');
const { isAdmin, isOwnerOrAdmin } = require('../middleware/roles');

//Public routers
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

//Protected Routes by authMiddleware
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del usuario
 *                   name:
 *                     type: string
 *                     description: Nombre del usuario
 *                   email:
 *                     type: string
 *                     description: Correo electrónico
 *                   password:
 *                     type:string 
 *                     description: contraseña de usuario
 */

router.get('/', authMiddleware, isAdmin, userController.getUsers);
router.get('/:id', authMiddleware, isOwnerOrAdmin, userController.getUserById);
router.put('/:id', authMiddleware, isOwnerOrAdmin, userController.updateUser);
router.delete('/:id', authMiddleware, isAdmin, userController.deleteUser);


module.exports = router;
