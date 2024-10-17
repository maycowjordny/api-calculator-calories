import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentSessionRepository } from '@/infra/database/repositories/payment-session-repository';
import { CreatePaymentSessionException } from './errors/create-payment-session-exception';

export class FindPaymentSessionBySessionIdUseCase {
  constructor(private paymentSessionRepository: PaymentSessionRepository) {}

  async execute(sessionId?: string): Promise<PaymentSession | null> {
    try {
      if (!sessionId) return null;

      return await this.paymentSessionRepository.findBySessionId(sessionId);
    } catch (err) {
      throw new CreatePaymentSessionException(err);
    }
  }
}
