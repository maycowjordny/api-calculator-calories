import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentSessionProps } from '@/domain/interfaces/payment-session';
import { PaymentSessionRepository } from '@/infra/database/repositories/payment-session-repository';
import { CreatePaymentSessionException } from './errors/create-payment-session-exception';

export class CreatePaymentSessionUseCase {
  constructor(private paymentSessionRepository: PaymentSessionRepository) {}

  async execute(inputPaymentSession: PaymentSessionProps): Promise<PaymentSession> {
    try {
      return await this.paymentSessionRepository.create(inputPaymentSession);
    } catch (err) {
      throw new CreatePaymentSessionException(err);
    }
  }
}
