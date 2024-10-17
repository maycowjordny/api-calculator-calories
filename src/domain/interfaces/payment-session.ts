import { PaymentTypeEnum } from '../enum/payment-type';

export interface PaymentSessionProps {
  sessionId: string;
  paymentType: PaymentTypeEnum;
  isPaid: boolean;
  email: string;
}
