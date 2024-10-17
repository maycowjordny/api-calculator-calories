import { UseCaseError } from '@/application/errors/use-case-errors';

export class WebhookException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao se comunicar com o webhook: ${err}.`);
    this.name = 'WebhookException';
  }
}
