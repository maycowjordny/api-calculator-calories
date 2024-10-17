import { FastifyInstance } from 'fastify';
import { VerifyPaymentSessionController } from '../controller/verify-payment-session';

const verifyPaymentSessionController = new VerifyPaymentSessionController();

export async function verifyPaymentSessionRoutes(app: FastifyInstance) {
  app.post('/', verifyPaymentSessionController.verify);
}
