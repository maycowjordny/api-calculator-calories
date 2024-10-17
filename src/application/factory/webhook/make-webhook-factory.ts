import { CreatePaymentSessionUseCase } from '@/application/use-cases/payment-session/create-payment-session';
import { WebHookUseCase } from '@/application/use-cases/webhook/webhook-use-case';
import { PrismaPaymentSessionRepository } from '@/infra/database/prisma/repositories/prisma-payment-session-repository';

export function makeWebhook() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const createPaymentSession = new CreatePaymentSessionUseCase(paymentSessionRepository);
  const webhookUseCase = new WebHookUseCase(createPaymentSession);

  return webhookUseCase;
}
