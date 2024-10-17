import { Entity } from '../../core/domain/Entity';
import { PaymentTypeEnum } from '../enum/payment-type';

export type PaymentSessionProps = {
  id: string;
  sessionId: string;
  isPaid: boolean;
  paymentType: PaymentTypeEnum;
  email: string | null | undefined;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PaymentSession extends Entity<PaymentSessionProps> {
  get id() {
    return this.props.id;
  }

  get sessionId() {
    return this.props.sessionId;
  }

  get isPaid() {
    return this.props.isPaid;
  }

  get email() {
    return this.props.email;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: PaymentSessionProps) {
    const paymentsession = new PaymentSession({
      ...props,
    });

    return paymentsession;
  }
}
