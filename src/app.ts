import cors from "@fastify/cors";
import fastify from "fastify";
import { appRoutes } from "./infra/http/rest/routes/index.routes";

export const app = fastify();

app.register(appRoutes);
app.register(cors, {
  origin: "*",
});
