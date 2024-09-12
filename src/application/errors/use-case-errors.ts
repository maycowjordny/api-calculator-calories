export class UseCaseError extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}
