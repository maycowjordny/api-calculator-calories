import { UseCaseError } from '@/application/errors/use-case-errors';

export class CreateCheckoutException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao processar pagamento: ${err}.`);
    this.name = 'CreateCheckoutException';
  }
}
