import cors from "@fastify/cors";
import axios from "axios";
import fastify from "fastify";
import cron from "node-cron";
import { appRoutes } from "./infra/http/rest/routes/index.routes";
export const app = fastify();

app.get("/cron", async (request, reply) => {
  reply.status(200).send("ok");
});

cron.schedule("*/5 * * * *", async () => {
  try {
    const response = await axios.get(
      "https://api-calculator-calories-1.onrender.com/ping"
    );
    console.log("Server pinged:", response.data);
  } catch (error) {
    console.error("Error pinging server:", error);
  }
});

app.register(appRoutes);
app.register(cors, {
  origin: "*",
});
