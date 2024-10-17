import { UseCaseError } from '@/application/errors/use-case-errors';

export class DietDescriptionFailedException extends UseCaseError {
  constructor() {
    super('Erro ao gerar dieta');
    this.name = 'DietDescriptionFailedException';
  }
}
