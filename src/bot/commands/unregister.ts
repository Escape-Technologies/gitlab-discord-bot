import { CommandResult } from './entities';
import { userManager } from '../../managers';

export async function unregister(
  discordId: string,
  gitlabId: string
): Promise<CommandResult> {
  if (!userManager.isWatching(gitlabId, discordId)) {
    return { error: `You are not watching changes for \`${gitlabId}\`` };
  }
  try {
    await userManager.removeWatcher(gitlabId, discordId);
  } catch {
    return {
      error: `Oops ! We could not unregister you from \`${gitlabId}\`.`
    };
  }
  return { result: { message: `Succesfully unregistered \`${gitlabId}\`` } };
}
