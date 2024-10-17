import { FastifyInstance } from 'fastify';
import { CreateDietController } from '../controller/create-diet-controller';

const createDietController = new CreateDietController();

export async function createDietRoutes(app: FastifyInstance) {
  app.post('/', createDietController.create);
}
