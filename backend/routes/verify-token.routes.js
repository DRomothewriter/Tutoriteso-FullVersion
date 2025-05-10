const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());

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