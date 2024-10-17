import { UseCaseError } from '@/application/errors/use-case-errors';

export class DietNotFoundException extends UseCaseError {
  constructor() {
    super(`Não foi possível encontrar uma dieta.`);
    this.name = 'DietNotFoundException';
  }
}
