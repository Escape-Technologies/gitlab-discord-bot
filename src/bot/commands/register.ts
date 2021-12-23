import { CommandResult } from './entities';
import { userManager } from '../../managers';

export async function register(
  discordId: string,
  gitlabId: string
): Promise<CommandResult> {
  if (userManager.isWatching(gitlabId, discordId)) {
    return { error: `You are already watching \`${gitlabId}\` !` };
  }
  try {
    await userManager.addWatcher(gitlabId, discordId);
    return { result: { message: `Succesfully registered \`${gitlabId}\`` } };
  } catch (e) {
    console.error(e);
    return { error: 'Oops! Something went wrong' };
  }
}
