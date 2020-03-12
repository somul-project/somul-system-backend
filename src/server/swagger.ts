import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  apis: ['**/*.ts'],
  basePath: '/',
  swaggerDefinition: {
    info: {
      description: 'Somul Backend API',
      swagger: '2.0',
      title: 'Dessert API',
      version: '1.0.0',
    },
  },
};
const specs = swaggerJsdoc(options);
export default specs;
