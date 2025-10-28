import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Digisign API",
      version: "1.0.0",
      description: "API documentation for Digisign Server"
    },
    servers: [
      { url: "http://localhost:5000" }
    ]
  },
  apis: ["./src/routes/*.ts"], // Path ke file yang ada JSDoc
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiHandler = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);