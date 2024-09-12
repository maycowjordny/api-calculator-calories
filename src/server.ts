import { app } from "./app";

const PORT = 4444;

app
  .listen({
    port: PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    const address = `http://localhost:${PORT}`;
    console.log(`🚀 HTTP Server is Running on ${address}!`);
  })
  .catch((err: any) => {
    console.log({
      server: `❌ HTTP Server Failed on port ${PORT}!`,
      error: err,
    });
  });
