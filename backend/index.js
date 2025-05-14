require('dotenv').config();

const cors = require("cors");
const express = require('express');
const connectDB = require('./config/database');
const setupSwagger = require("./config/swaggerConfig");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const path = require("path");
=======
>>>>>>> origin/Victor

const app = express();
connectDB();

<<<<<<< HEAD
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(cookieParser());
=======
// Middleware para permitir CORS
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
})); // Habilita CORS para todas las rutas

app.use(cookieParser());

// Para aceptar y procesar datos en formato JSON
>>>>>>> origin/Victor
app.use(express.json());
setupSwagger(app);

// Rutas de los modelos
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const asesoriaRoutes = require('./routes/asesoria.routes');
const materiaRoutes = require('./routes/materia.routes');
const postForoRoutes = require('./routes/postForo.routes');
const comentarioRoutes = require('./routes/comentario.routes');
const usuarioRoutes = require('./routes/usuario.routes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/asesorias', asesoriaRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/posts', postForoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/usuario', usuarioRoutes);

<<<<<<< HEAD
// Verificación de token
=======
// Nueva ruta para verificar la autenticación del usuario mediante cookies
>>>>>>> origin/Victor
app.get('/api/verify-token', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token no encontrado" });
    }

    try {
<<<<<<< HEAD
=======
        // Verifica el token con la clave secreta
>>>>>>> origin/Victor
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: "Token válido", user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
});

<<<<<<< HEAD
app.get("*", (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, "../FrontendTutorias/Views/index.html"));
  } else {
    res.status(404).json({ message: "Ruta no encontrada" });
  }
});


=======
>>>>>>> origin/Victor
// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});