require('dotenv').config();

const cors = require("cors");  // Importar el paquete cors
const express = require('express');
const connectDB = require('./config/database');
const setupSwagger = require("./config/swaggerConfig");

// Rutas existentes
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

// Nuevas rutas
const asesoriaRoutes = require('./routes/asesoria.routes');
const materiaRoutes = require('./routes/materia.routes');
const postForoRoutes = require('./routes/postForo.routes');
const comentarioRoutes = require('./routes/comentario.routes');
const usuarioRoutes = require('./routes/usuario.routes');
// Rutas de usuario, productos y pedidos
const app = express();

connectDB();

// Middleware para permitir CORS
app.use(cors(
  {
    origin:"http://127.0.0.1:5500",
    credentials:true
  }
)); // Habilita CORS para todas las rutas

// Para aceptar y procesar datos en formato JSON
app.use(express.json());
setupSwagger(app);

// Rutas de los modelos
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Nuevas rutas para Asesorías, Materias, Posts de Foro y Comentarios
app.use('/api/asesorias', asesoriaRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/posts', postForoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/usuario', usuarioRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
