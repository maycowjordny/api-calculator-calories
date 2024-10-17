import { FastifyInstance } from 'fastify';
import { WebhookController } from '../controller/webhook-controller';
const webhookController = new WebhookController();

export async function webhookRoutes(app: FastifyInstance) {
  app.post('/', { config: { rawBody: true } }, webhookController.create);
}
