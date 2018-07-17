import KitsuProvider from './providers/kitsu-provider';
import AnilistProvider from './providers/anilist-provider';

function selectTracker(type: string, ...args: any[]) {
  switch (type.toLowerCase()) {
    case 'anilist':
      return new AnilistProvider(...args);
    case 'kitsu':
      return new KitsuProvider(args[0], args[1]);
  }
}
export default selectTracker;
