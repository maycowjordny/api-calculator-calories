import { app } from "@/app";
import { createCaloriesRoutes } from "./create-calories.routes";
import { createDietRoutes } from "./create-diet.routes";

export async function appRoutes() {
  app.register(createCaloriesRoutes, { prefix: "/calculate-calories" });
  app.register(createDietRoutes, { prefix: "/api/gemini" });
}
