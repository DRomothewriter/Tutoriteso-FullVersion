const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const loginController = require('../controllers/login.controller');
const logoutController = require('../controllers/logout.controller');

const { authMiddleware, adminMiddleware } = require('../middleware/UserAuth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rutas para gestionar usuarios
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Permite crear un nuevo usuario (registro).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               name:
 *                 type: string
 *                 example: Juan Perez
 *               role:
 *                 type: string
 *                 enum: [client, admin]
 *                 example: client
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Petición inválida, falta algún dato necesario.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autenticar usuario (login)
 *     description: Permite a un usuario iniciar sesión con su correo electrónico y contraseña válidos. Devuelve un token JWT para futuras solicitudes autenticadas.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Autenticación exitosa, devuelve un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Credenciales incorrectas (email o contraseña erróneos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Correo electronico o contrasenia incorrectos
 *       500:
 *         description: Error interno del servidor al intentar autenticar.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error en el servidor
 */
router.post('/login', loginController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     description: Cierra la sesión del usuario autenticado eliminando la cookie del token.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada correctamente
 *       500:
 *         description: Error interno del servidor al cerrar sesión.
 */


router.post('/logout', logoutController.logout);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Solo los administradores pueden obtener la lista de todos los usuarios.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *       403:
 *         description: No autorizado, solo los administradores pueden acceder a esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Permite a los administradores o al propio usuario obtener sus propios datos.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario por ID
 *     description: Permite a un administrador o al propio usuario actualizar sus datos.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Perez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nuevoemail@example.com
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *             required:
 *               - name
 *               - email
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       400:
 *         description: Petición inválida.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     description: Solo un administrador puede eliminar usuarios.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;
