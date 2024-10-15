import { CreateDietUseCase } from "@/application/use-cases/diet/create-diet-use-case";
import { FindPaymentSessionBySessionIdUseCase } from "@/application/use-cases/payment-session/find-payment-session-by-session-id";
import { VerifyPaymentSessionUseCase } from "@/application/use-cases/payment-session/verify-payment-session";
import { PrismaDietRepository } from "@/infra/database/prisma/repositories/prisma-diet-repository";
import { PrismaPaymentSessionRepository } from "@/infra/database/prisma/repositories/prisma-payment-session-repository";

export function makeCreateDiet() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const dietRepository = new PrismaDietRepository();

  const findPaymentSessionBySessionIdUseCase =
    new FindPaymentSessionBySessionIdUseCase(paymentSessionRepository);

  const verifyPaymentSessionUseCase = new VerifyPaymentSessionUseCase(
    findPaymentSessionBySessionIdUseCase
  );

  const createDietUseCase = new CreateDietUseCase(
    dietRepository,
    verifyPaymentSessionUseCase
  );

  return createDietUseCase;
}
