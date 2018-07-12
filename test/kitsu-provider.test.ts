
import {
    isEmpty,
    get
} from "lodash";
import {
    listEntry
} from "src/util/types";
import KitsuProvider from "./../src/providers/kitsu-provider";
const dotenv = require("dotenv"); // eslint-disable-line
dotenv.config();
const opts = {
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || ''
};
const USERNAME = process.env.EMAIL || "";
const PASSWORD = process.env.PASSWORD || "";
const TOKEN = process.env.TOKEN || "";
describe('kitsu provider', () => {
  let provider: KitsuProvider;

  beforeAll(() => {
    provider = new KitsuProvider(TOKEN, opts);
  });

  test('should get a token', async () => {
        const token:string = await provider.getToken(USERNAME, PASSWORD);
        expect(token).toBeDefined();
  });

  test('should search anime', async () => {
    const searchAnime = await provider.searchAnime("naruto");
    expect(searchAnime.length).toEqual(10);
  });

  test('should get user list', async () => {
    const list = await provider.getUserList();
    expect(list.length).toEqual(10);
  });

  test('should update anime list entry', async () => {
    const blackCloverId: number = 13209;
    const episode: number = 32;
    const params = { id: blackCloverId, progress: episode };
    const data = await provider.updateAnime(params);
    expect(data.attributes.progress).toEqual(episode);
  });

  test('should remove user list entry', async () => {
    //get the entry number since changes every time
    const list = await provider.getUserList();
    const item = list.find((entry: any) => entry.anime.id === '13209');
    if (isEmpty(item)) throw "error didn't find record needed for test"
    //delete entry
    const removeAnime = await provider.removeAnime(item.id);
    expect(removeAnime).toBeDefined();
  });

  test('should add anime to list entry', async () => {
    //get the entry number since changes every time
    const list = await provider.getUserList();
    const item = list.find((entry: any) => entry.anime.id === '13209');
    if(isEmpty(item)) throw "error didn't find record needed for test"
    //delete entry
    const removeAnime = await provider.removeAnime(item.id);
    expect(removeAnime).toBeDefined();
    //add anime
    const blackCloverId: number = 13209;
    const episode: number = 32;
    const status: string = 'current';
    const data = await provider.addAnime({
      animeId: get(item, "anime.id", blackCloverId),
      progress: episode,
      status
    });
    const {attributes, anime} = data;
    expect(attributes.progress).toBe(episode);
    expect(attributes.status).toBe(status);
    expect(anime.id).toBe(blackCloverId);
  });

});
