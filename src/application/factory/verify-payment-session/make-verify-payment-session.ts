import { FindPaymentSessionBySessionIdUseCase } from '@/application/use-cases/payment-session/find-payment-session-by-session-id';
import { VerifyPaymentSessionUseCase } from '@/application/use-cases/payment-session/verify-payment-session';
import { PrismaPaymentSessionRepository } from '@/infra/database/prisma/repositories/prisma-payment-session-repository';

export function makeVerifyPaymentSession() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const findPaymentSessionBySessionIdUseCase = new FindPaymentSessionBySessionIdUseCase(
    paymentSessionRepository
  );

  const verifyPaymentSessionUseCase = new VerifyPaymentSessionUseCase(
    findPaymentSessionBySessionIdUseCase
  );

  return verifyPaymentSessionUseCase;
}
