import { UseCaseError } from '@/application/errors/use-case-errors';

export class CreateDietException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao criar dieta: ${err}.`);
    this.name = 'CreateDietException';
  }
}
