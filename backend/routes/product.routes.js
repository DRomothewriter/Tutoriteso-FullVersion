const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth');
const {isAdmin} = require('../middleware/roles');

//Protected Routes by authMiddleware

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - img
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Reloj elegante"
 *               description:
 *                 type: string
 *                 example: "Especial para tus reuniones ejecutivas"
 *               price:
 *                 type: number
 *                 example: 9999.99
 *               img:
 *                 type: string
 *                 example: "https://ejemplo.com/reloj.jpg"
 *               stock:
 *                 type: number
 *                 example: 100
 *               category:
 *                 type: string
 *                 example: "Elegante"
 *               sku:
 *                 type: string
 *                 example: "SKU12345"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

router.get('/', authMiddleware, productController.getProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.post('/', authMiddleware, isAdmin,productController.createProduct);
router.put('/:id', authMiddleware, isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware, isAdmin,productController.deleteProduct);


module.exports = router;
