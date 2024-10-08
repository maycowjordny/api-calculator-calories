import { app } from "@/app";
import { createCaloriesRoutes } from "./calories.routes";
import { createCheckoutRoutes } from "./checkout.routes";
import { createDietRoutes } from "./diet.routes";

export async function appRoutes() {
  app.register(createCaloriesRoutes, { prefix: "/calculate-calories" });
  app.register(createDietRoutes, { prefix: "/api/gemini" });
  app.register(createCheckoutRoutes, { prefix: "/checkout" });
}
