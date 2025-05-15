const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TutorITESO API",
      version: "1.0.0",
      description: "Documentación de la API para TutorITESO"
    },
  },
  apis: ["./routes/*.js"], // ✅ Asegúrate que esta ruta apunta a tus archivos con anotaciones Swagger
};

const specs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
