import { UseCaseError } from '@/application/errors/use-case-errors';

export class CreateCaloriesException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao criar as calorias : ${err}.`);
    this.name = 'CreateCalorieasException';
  }
}
