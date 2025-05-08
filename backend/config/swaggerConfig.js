const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const setupSwagger = (app) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
