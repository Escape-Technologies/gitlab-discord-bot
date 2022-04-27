import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app/app.module';
import { env } from 'app/libs/environment';
import { logger } from 'app/libs/logger';
import { DiscordService } from './modules/discord/discord.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(logger);

  const bot = app.get(DiscordService);
  await bot.start();

  await app.listen(env.serverPort, () => {
    logger.success(`Server listening on port ${env.serverPort}`);
    // bot.hello();
  });
}

bootstrap();
