import KitsuProvider from './providers/kitsu-provider';
import AnilistProvider from './providers/anilist-provider';

function universalTracker(
  type: string,
  ...args: any[]
): AnilistProvider | KitsuProvider {
  switch (type.toLowerCase()) {
    case 'anilist':
      return new AnilistProvider(...args);
    case 'kitsu':
      return new KitsuProvider(args[0], args[1]);
  }
}
export default universalTracker;
