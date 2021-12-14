import { GitlabBot } from './bot';

const bot = new GitlabBot();

async function main() {
  await bot.start();
  //bot.hello();
}

main();
