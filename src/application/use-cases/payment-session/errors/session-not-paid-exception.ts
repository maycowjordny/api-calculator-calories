import { UseCaseError } from "@/application/errors/use-case-errors";

export class SessionNotPaidException extends UseCaseError {
  constructor() {
    super(
      `A sessão não foi paga, e não é possível gerar uma dieta personalizada sem excluir alimentos.`
    );
    this.name = "SessionNotPaidException";
  }
}
