import {
  listEntry,
  Anime,
  inputAnime
} from "src/util/types";
import AnilistProvider from "./../src/providers/anilist-provider";
const dotenv = require("dotenv"); // eslint-disable-line
dotenv.config();
const debug:boolean = true;
const TOKEN = process.env.ANILIST_TOKEN || "";
function log(...theArgs: any[]) {
  if (debug) {
    console.log(theArgs); // eslint-disable-line
  }
}
//TODO add verification that the types are full of what it needs to be
describe('Anilist provider', () => {
  let provider: KitsuProvider;

  beforeAll(() => {
    provider = new AnilistProvider(TOKEN);
  });
  it('should getUserList: get all current logged in users list ', async () => {
    const animeList: Array<listEntry> =  await provider.getUserList();
    expect(animeList.length).toBeGreaterThanOrEqual(1);

  });
  it('should getUserList: get all current logged in users list and update tokyo ghoul to ep 2 ', async () => {
    const updateEp = 2;
    const result = await provider.getUserList();
    const media:listEntry = result.find((val: listEntry) => val.anime.id === 100240);
    log('This is the element: %O', media);
    const updateAnimeInput: Partial<inputAnime> = { id: media.id, anime_id: media.anime.id, progress: updateEp };
    const updatedEntry: Partial<listEntry> = await provider.updateAnime(updateAnimeInput);
    log('This is what the result of update is: %O', updatedEntry);
    expect(updatedEntry.progress).toEqual(updateEp);
  });
  it("should searchAnime for naruto and return a list", async () => {
    const animes: Array<Anime> = await provider.searchAnime("naruto");
    expect(animes.length).toBeGreaterThan(1);
    log(animes);
  });
  it('should add anime 1535 death note and delete entry', async () => {
    const addEntry: Partial<inputAnime> = { anime_id: 1535, status: "CURRENT", progress: 1 };
    const val:any = await provider.addAnime(addEntry);
    log(val);
    const result:any = await provider.removeAnime(val.id);
    log(result);
  });
});
