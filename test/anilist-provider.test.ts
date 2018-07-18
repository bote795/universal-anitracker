import { ListEntry, Anime, InputAnime } from 'lib/util/types';
import AnilistProvider from './../lib/providers/anilist-provider';
import universalAnitracker from './../lib/index';
import KitsuProvider from '../lib/providers/kitsu-provider';
/* tslint:disable:no-var-requires */
const dotenv = require('dotenv');
/* tslint:enable:no-var-requires */

dotenv.config();
const debug: boolean = false;
const TOKEN = process.env.ANILIST_TOKEN || '';
function log(...theArgs: any[]) {
  if (debug) {
    /* tslint:disable:no-console */
    console.log(theArgs);
    /* tslint:enable:no-console */
  }
}
// TODO add verification that the types are full of what it needs to be
describe('Anilist provider', () => {
  let provider: AnilistProvider | KitsuProvider;

  beforeAll(() => {
    provider = universalAnitracker("anilist", TOKEN);
  });
  it('should getUserList: get all current logged in users list ', async () => {
    const animeList: ListEntry[] = await provider.getUserList();
    expect(animeList.length).toBeGreaterThanOrEqual(1);
  });
  it('should getUserList: get all current logged in users list and update tokyo ghoul to ep 2 ', async () => {
    const updateEp = 2;
    const result = await provider.getUserList();
    const media: ListEntry = result.find(
      (val: ListEntry) => val.anime.id === 100240
    );
    log('This is the element: %O', media);
    const updateAnimeInput: Partial<InputAnime> = {
      id: media.id,
      anime_id: media.anime.id,
      progress: updateEp,
    };
    const updatedEntry: Partial<ListEntry> = await provider.updateAnime(
      updateAnimeInput
    );
    log('This is what the result of update is: %O', updatedEntry);
    expect(updatedEntry.progress).toEqual(updateEp);
  });
  it('should searchAnime for naruto and return a list', async () => {
    const animes: Anime[] = await provider.searchAnime('naruto');
    expect(animes.length).toBeGreaterThan(1);
    log(animes);
  });
  it('should add anime 1535 death note and delete entry', async () => {
    const addEntry: Partial<InputAnime> = {
      anime_id: 1535,
      status: 'CURRENT',
      progress: 1,
    };
    const val: any = await provider.addAnime(addEntry);
    log(val);
    const result: any = await provider.removeAnime(val.id);
    log(result);
  });
});
