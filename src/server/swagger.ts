import swaggerJsdoc from 'swagger-jsdoc';
import * as constants from '../common/constants';

const options = {
  apis: ['**/*.ts'],
  basePath: '/',
  swaggerDefinition: {
    info: {
      description: 'Somul Backend API about Authenticate',
      swagger: '2.0',
      title: 'Somul Backend API',
      version: constants.VERSION,
    },
  },
};
const specs = swaggerJsdoc(options);
export default specs;
