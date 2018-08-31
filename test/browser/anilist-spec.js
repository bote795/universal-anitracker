import universalAnitracker from '../../node/index';
const qaToken = Cypress.env('ANILIST_TOKEN');
const debug = false;
function log(...theArgs) {
  if (debug) {
    /* tslint:disable:no-console */
    console.log(theArgs);
    /* tslint:enable:no-console */
  }
}

describe('Anilist provider', () => {
  let provider;

  before(() => {
    provider = universalAnitracker('anilist', qaToken);
  });
  it('should getUserList: get all current logged in users list ', async () => {
    const animeList = await provider.getUserList();
    assert.equal(animeList.length >= 1, true);
  });
  it('should getUserList: get all current logged in users list and update tokyo ghoul to ep 2 ', async () => {
    const updateEp = 2;
    const result = await provider.getUserList();
    const media = result.find(val => val.anime.id === 100240);
    log('This is the element: %O', media);
    const updateAnimeInput = {
      id: media.id,
      anime_id: media.anime.id,
      progress: updateEp,
    };
    const updatedEntry = await provider.updateAnime(updateAnimeInput);
    log('This is what the result of update is: %O', updatedEntry);
    assert.equal(updatedEntry.progress,updateEp);
  });
  it('should searchAnime for naruto and return a list', async () => {
    const animes = await provider.searchAnime('naruto');
    assert.equal(animes.length>=1,true);
    log(animes);
  });
  it('should add anime 1535 death note and delete entry', async () => {
    const addEntry = {
      anime_id: 1535,
      status: 'CURRENT',
      progress: 1,
    };
    const val = await provider.addAnime(addEntry);
    log('this is the anilist add response: %O', val);
    assert.equal(val.progress, addEntry.progress);
    const result = await provider.removeAnime(val.id);
    log(result);
  });
});
