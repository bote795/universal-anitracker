import { isEmpty, get } from 'lodash';
import { InputAnime } from 'lib/util/types';
import KitsuProvider from './../lib/providers/kitsu-provider';

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

describe('kitsu provider', () => {
  let provider: KitsuProvider;

  beforeAll(() => {
    provider = new KitsuProvider(TOKEN, opts);
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
      const status: string = 'current';
      const { data } = await provider.addAnime({
        anime_id: blackCloverId,
        progress: episode,
        status,
      });
      const { attributes } = data;
      expect(attributes.progress).toBe(episode);
      expect(attributes.status).toBe(status);
      list = await provider.getUserList();
      item = list.find((entry: any) => entry.anime.id === '13209');
    }

    const params: Partial<InputAnime> = { id: item.id, progress: episode };
    const resp = await provider.updateAnime(params);
    expect(resp.data.attributes.progress).toEqual(episode);
  });

  test('should remove user list entry', async () => {
    // get the entry number since changes every time
    let list = await provider.getUserList();
    let item: any = list.find((entry: any) => entry.anime.id === '13209');
    if (isEmpty(item)) {
      // add anime
      const blackCloverId: number = 13209;
      const episode: number = 32;
      const status: string = 'current';
      const { data } = await provider.addAnime({
        anime_id: blackCloverId,
        progress: episode,
        status,
      });
      const { attributes } = data;
      expect(attributes.progress).toBe(episode);
      expect(attributes.status).toBe(status);

      list = await provider.getUserList();
      item = list.find((entry: any) => entry.anime.id === '13209');
    }
    // delete entry
    const removeAnime = await provider.removeAnime(item.id);
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
    const episode: number = 32;
    const status: string = 'current';
    const { data } = await provider.addAnime({
      anime_id: get(item, 'anime.id', blackCloverId),
      progress: episode,
      status,
    });
    const { attributes } = data;
    expect(attributes.progress).toBe(episode);
    expect(attributes.status).toBe(status);
  });
});
