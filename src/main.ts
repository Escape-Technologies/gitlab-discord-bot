import bot from './bot';
import { userManager } from './managers';
import server from './server';
import { env } from './utils/environment';

async function main() {
  await userManager.init();
  await bot.start();
  await server.listen(env.serverPort);
  // bot.hello();
}

main();
