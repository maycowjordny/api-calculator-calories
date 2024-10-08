import { FastifyInstance } from "fastify";
import { CreateCaloriesController } from "../controller/create-calories-controller";

const createCaloriesController = new CreateCaloriesController();

export async function createCaloriesRoutes(app: FastifyInstance) {
  app.post("/", createCaloriesController.create);
}
