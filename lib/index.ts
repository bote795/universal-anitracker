import AnilistProvider from './providers/anilist-provider';
import KitsuProvider from './providers/kitsu-provider';
import { universalTrackerProvider } from './@types/types';

function universalTracker(
  type: string,
  ...args: any[]
): universalTrackerProvider {
  switch (type.toLowerCase()) {
    case 'anilist':
      return new AnilistProvider(...args);
    case 'kitsu':
      return new KitsuProvider(args[0], args[1]);
  }
}
export default universalTracker;
