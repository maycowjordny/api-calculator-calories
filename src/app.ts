import cors from '@fastify/cors';
import axios from 'axios';
import 'dotenv/config';
import fastify from 'fastify';
import fastifyRawBody from 'fastify-raw-body';
import cron from 'node-cron';
import { appRoutes } from './infra/http/rest/routes/index.routes';
export const app = fastify();

app.get('/cron', async (request, reply) => {
  reply.status(200).send('ok');
});

cron.schedule('*/5 * * * *', async () => {
  try {
    await axios.get('https://api-calculator-calories-1.onrender.com/cron');
  } catch (error) {
    console.error('Error pinging server:', error);
  }
});

app.register(fastifyRawBody, {
  field: 'rawBody',
  global: false,
  encoding: 'utf8',
  runFirst: true,
});

app.register(appRoutes);
app.register(cors, {
  origin: '*',
});
