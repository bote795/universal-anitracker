import { isEmpty, get } from 'lodash';
import { InputAnime } from 'lib/util/types';
import universalAnitracker from './../lib/index';
import KitsuProvider from './../lib/providers/kitsu-provider';
import AnilistProvider from '../lib/providers/anilist-provider';

/* tslint:disable:no-var-requires */
const dotenv = require('dotenv');
/* tslint:enable:no-var-requires */

dotenv.config();
const opts = {
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
};
const USERNAME = process.env.EMAIL || '';
const PASSWORD = process.env.PASSWORD || '';
const TOKEN = process.env.TOKEN || '';
const debug: boolean = false;

function log(...theArgs: any[]) {
  if (debug) {
    /* tslint:disable:no-console */
    console.log(theArgs);
    /* tslint:enable:no-console */
  }
}
describe('kitsu provider', () => {
  let provider: KitsuProvider | AnilistProvider;

  beforeAll(async () => {
    provider = universalAnitracker('kitsu', TOKEN, opts);
    const token: string = await provider.getToken(USERNAME, PASSWORD);
    expect(token).toBeDefined();
  });

  test('should get a token', async () => {
    const token: string = await provider.getToken(USERNAME, PASSWORD);
    expect(token).toBeDefined();
  });

  test('should search anime', async () => {
    const searchAnime = await provider.searchAnime('naruto');
    expect(searchAnime.length).toEqual(10);
  });

  test('should get user list', async () => {
    const list = await provider.getUserList();
    expect(list.length).toBeGreaterThanOrEqual(11);
  });

  test('should update anime list entry', async () => {
    const blackCloverId: number = 13209;
    const episode: number = 32;
    let list = await provider.getUserList();
    let item: any = list.find((entry: any) => entry.anime.id === '13209');
    if (isEmpty(item)) {
      // add anime
      const statusExpected: string = 'current';
      const { progress, status } = await provider.addAnime({
        anime_id: blackCloverId,
        progress: episode,
        status: statusExpected,
      });
      expect(progress).toBe(episode);
      expect(status).toBe(statusExpected);
      list = await provider.getUserList();
      item = list.find((entry: any) => entry.anime.id === '13209');
    }

    const params: Partial<InputAnime> = { id: item.id, progress: episode };
    const resp = await provider.updateAnime(params);
    log('This is my resp %O', JSON.stringify(resp));
    expect(resp.progress).toEqual(episode);
  });

  test('should remove user list entry', async () => {
    // get the entry number since changes every time
    let list = await provider.getUserList();
    let item: any = list.find((entry: any) => entry.anime.id === '13209');
    if (isEmpty(item)) {
      // add anime
      const blackCloverId: number = 13209;
      const episodeExpected: number = 32;
      const statusExpected: string = 'current';

      const { progress, status } = await provider.addAnime({
        anime_id: blackCloverId,
        progress: episodeExpected,
        status: statusExpected,
      });
      expect(progress).toBe(episodeExpected);
      expect(status).toBe(statusExpected);

      list = await provider.getUserList();
      item = list.find((entry: any) => entry.anime.id === '13209');
    }
    // delete entry
    const removeAnime = await provider.removeAnime(item.id);
    log(removeAnime);
    expect(removeAnime).toBeDefined();
  });

  test('should add anime to list entry', async () => {
    // get the entry number since changes every time
    const list = await provider.getUserList();
    const item: any = list.find((entry: any) => entry.anime.id === '13209');
    if (!isEmpty(item)) {
      // delete entry
      const removeAnime = await provider.removeAnime(item.id);
      expect(removeAnime).toBeDefined();
    }
    // add anime
    const blackCloverId: number = 13209;
    const episodeExpected: number = 32;
    const statusExpected: string = 'current';
    const { progress, status } = await provider.addAnime({
      anime_id: get(item, 'anime.id', blackCloverId),
      progress: episodeExpected,
      status: statusExpected,
    });
    expect(progress).toBe(episodeExpected);
    expect(status).toBe(statusExpected);
  });
});
