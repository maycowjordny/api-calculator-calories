import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentSessionProps } from '@/domain/interfaces/payment-session';

export interface PaymentSessionRepository {
  create(data: PaymentSessionProps): Promise<PaymentSession>;
  findBySessionId(sessionId?: string): Promise<PaymentSession | null>;
}
