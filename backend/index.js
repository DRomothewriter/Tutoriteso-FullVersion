require('dotenv').config();

const cors = require("cors");  // Importar el paquete cors
const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const setupSwagger = require("./swaggerConfig");


const app = express();
connectDB();

setupSwagger(app); // <-  activa swagger

// Middleware para permitir CORS
app.use(cors({
    origin: "https://tutoriteso-fullversion-1.onrender.com", // URL de tu Frontend
    credentials: true
})); // Habilita CORS para todas las rutas

app.use(cookieParser());

// Para aceptar y procesar datos en formato JSON
app.use(express.json());


// Rutas de los modelos
const userRoutes = require('./routes/user.routes');
const asesoriaRoutes = require('./routes/asesoria.routes');
const materiaRoutes = require('./routes/materia.routes');
const postForoRoutes = require('./routes/postForo.routes');
const comentarioRoutes = require('./routes/comentario.routes');

app.use('/api/users', userRoutes);
app.use('/api/asesorias', asesoriaRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/posts', postForoRoutes);
app.use('/api/comentarios', comentarioRoutes);

// Ruta para verificar la autenticación del usuario mediante cookies
app.get('/api/verify-token', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token no encontrado" });
    }

    try {
        // Verifica el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: "Token válido", user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});