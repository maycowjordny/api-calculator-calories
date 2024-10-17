import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { SessionNotPaidException } from './errors/session-not-paid-exception';
import { FindPaymentSessionBySessionIdUseCase } from './find-payment-session-by-session-id';

export class VerifyPaymentSessionUseCase {
  constructor(private findPaymentSessionBySessionIdUseCase: FindPaymentSessionBySessionIdUseCase) {}

  async execute(sessionId?: string): Promise<PaymentSession> {
    const session = await this.findPaymentSessionBySessionIdUseCase.execute(sessionId);

    if (!session || !session.isPaid) throw new SessionNotPaidException();

    return session;
  }
}
