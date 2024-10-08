import { FastifyInstance } from "fastify";
import { CreateCheckoutController } from "../controller/create-checkout-controller";

const createCheckoutController = new CreateCheckoutController();

export async function createCheckoutRoutes(app: FastifyInstance) {
  app.post("/", createCheckoutController.create);
}
