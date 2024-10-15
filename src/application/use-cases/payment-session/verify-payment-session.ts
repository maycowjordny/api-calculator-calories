import { FindPaymentSessionBySessionIdUseCase } from "./find-payment-session-by-session-id";

export class VerifyPaymentSessionUseCase {
  constructor(
    private findPaymentSessionBySessionIdUseCase: FindPaymentSessionBySessionIdUseCase
  ) {}

  async execute(sessionId?: string): Promise<boolean> {
    const paymentSession =
      await this.findPaymentSessionBySessionIdUseCase.execute(sessionId);

    if (!paymentSession || !paymentSession.isPaid) return false;

    return true;
  }
}
