import { PaymentSessionProps } from "@/domain/interfaces/payment-session";
import { Prisma } from "@prisma/client";
import { PaymentSessionMapper } from "./payment-session-mapper";

export class CreatePaymentSessionMapper extends PaymentSessionMapper {
  static toPrisma(
    paymentsession: PaymentSessionProps
  ): Prisma.PaymentSessionCreateInput {
    return {
      sessionId: paymentsession.sessionId,
      email: paymentsession.email,
      isPaid: paymentsession.isPaid,
    };
  }
}
