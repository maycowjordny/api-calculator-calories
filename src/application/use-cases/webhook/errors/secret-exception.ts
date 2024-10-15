import { UseCaseError } from "@/application/errors/use-case-errors";

export class SecretException extends UseCaseError {
  constructor(err: any) {
    super(`Erro na chave secreta: ${err}.`);
    this.name = "SecretException";
  }
}
