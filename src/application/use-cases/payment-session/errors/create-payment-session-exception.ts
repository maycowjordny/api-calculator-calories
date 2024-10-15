import { UseCaseError } from "@/application/errors/use-case-errors";

export class CreatePaymentSessionException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao criar sessão de pagamento: ${err}.`);
    this.name = "CreatePaymentSessionException";
  }
}
