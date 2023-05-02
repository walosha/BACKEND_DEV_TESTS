// https://blog.logrocket.com/documenting-express-js-api-swagger/
export const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BACKEND_DEV_TEST',
      version: '1.0.0',
      description: 'API documentation',
      contact: {
        name: 'bacnk-api',
        url: 'localhost:3000',
        email: 'walosha@yahoo.com',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },

  apis: ['./src/modules/**/*.ts'],
};
