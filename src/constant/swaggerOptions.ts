// https://blog.logrocket.com/documenting-express-js-api-swagger/
export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BACKEND_DEV_TEST',
      version: '0.1.0',
      description: 'Banking open API',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'LogRocket',
        url: 'localhost:3000',
        email: 'walosha@yahoo.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'],
};
