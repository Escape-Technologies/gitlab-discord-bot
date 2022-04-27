import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { logger } from 'app/libs/logger';

@Injectable()
export class DatabaseClient extends PrismaClient {
  constructor() {
    super();
    this.$connect().then(() =>
      logger.success(`Database connection established`),
    );

    process.on('beforeExit', async () => {
      logger.warn(
        'Received `beforeExit` event, closing database connection...',
      );
      await this.$disconnect();
      logger.warn('Connection closed.');
    });
  }
}
