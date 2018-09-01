import { isEmpty, get } from 'lodash';
import universalAnitracker from '../../node/index';

const opts = {
  clientId: Cypress.env('CLIENT_ID') || '',
  clientSecret: Cypress.env('CLIENT_SECRET') || '',
};
const USERNAME = Cypress.env('EMAIL');
const PASSWORD = Cypress.env('PASSWORD');

console.log(opts);
const debug = true;
function log(...theArgs) {
  if (debug) {
    /* tslint:disable:no-console */
    console.log(theArgs);
    /* tslint:enable:no-console */
  }
}

describe('kitsu provider', () => {
  let provider;

  before(async () => {
    provider = universalAnitracker('kitsu', null, opts);
    const token = await provider.getToken(USERNAME, PASSWORD);
    expect(!!token).to.equal(true);
  });

  it('should get a token', async () => {
    const token = await provider.getToken(USERNAME, PASSWORD);
    expect(!!token).to.equal(true);
  });

  it('should search anime', async () => {
    const searchAnime = await provider.searchAnime('naruto');
    expect(searchAnime.length).to.equal(10);
  });

  it('should get user list', async () => {
    const list = await provider.getUserList();
    expect(list.length).to.be.gte(11);
  });

  it('should update anime list entry', async () => {
    const blackCloverId = 13209;
    const episode = 32;
    let list = await provider.getUserList();
    let item = list.find(entry => entry.anime.id === '13209');
    if (isEmpty(item)) {
      // add anime
      const statusExpected = 'current';
      const { progress, status } = await provider.addAnime({
        anime_id: blackCloverId,
        progress: episode,
        status: statusExpected,
      });
      expect(progress).to.equal(episode);
      expect(status).to.equal(statusExpected);
      list = await provider.getUserList();
      item = list.find(entry => entry.anime.id === '13209');
    }

    const params = { id: item.id, progress: episode };
    const resp = await provider.updateAnime(params);
    log('This is my resp %O', JSON.stringify(resp));
    expect(resp.progress).to.equal(episode);
  });

  it('should remove user list entry', async () => {
    // get the entry number since changes every time
    let list = await provider.getUserList();
    let item = list.find(entry => entry.anime.id === '13209');
    if (isEmpty(item)) {
      // add anime
      const blackCloverId = 13209;
      const episodeExpected = 32;
      const statusExpected = 'current';

      const { progress, status } = await provider.addAnime({
        anime_id: blackCloverId,
        progress: episodeExpected,
        status: statusExpected,
      });
      expect(progress).to.equal(episodeExpected);
      expect(status).to.equal(statusExpected);

      list = await provider.getUserList();
      item = list.find(entry => entry.anime.id === '13209');
    }
    // delete entry
    const removeAnime = await provider.removeAnime(item.id);
    log('remove kitsu anime %O', removeAnime);
    expect(removeAnime).to.not.be.undefined;
  });

  it('should add anime to list entry', async () => {
    // get the entry number since changes every time
    const list = await provider.getUserList();
    const item = list.find(entry => entry.anime.id === '13209');
    if (!isEmpty(item)) {
      // delete entry
      const removeAnime = await provider.removeAnime(item.id);
      expect(removeAnime).to.not.be.undefined;
    }
    // add anime
    const blackCloverId = 13209;
    const episodeExpected = 32;
    const statusExpected = 'current';
    const { progress, status } = await provider.addAnime({
      anime_id: get(item, 'anime.id', blackCloverId),
      progress: episodeExpected,
      status: statusExpected,
    });
    expect(progress).to.equal(episodeExpected);
    expect(status).to.equal(statusExpected);
  });
});
