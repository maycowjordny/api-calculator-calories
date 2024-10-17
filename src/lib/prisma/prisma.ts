import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'dev' ? [] : [],
  datasources: {
    db: {
      url:
        process.env.NODE_ENV === 'prod'
          ? process.env.DATABASE_URL_PROD
          : process.env.DATABASE_URL_DEV,
    },
  },
});
