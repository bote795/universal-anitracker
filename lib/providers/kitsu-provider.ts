import { BasicProvider } from '../util/provider_interface';
import { isEmpty, pickBy, identity } from 'lodash';
import {
  Anime,
  listEntry,
  inputAnime,
  kitsuAddEntryPayload
} from '../util/types';
const Kitsu = require('kitsu/node');
const OAuth2 = require('client-oauth2');

class KitsuProvider implements BasicProvider {
  public accessToken: string = '';
  public clientId: string = '';
  public clientSecret: string = '';
  public provider: any = new Kitsu();
  public userId: number;
  static get TokenURL() {
    return 'https://kitsu.io/api/oauth/token';
  }
  public static Status(key: string): string | undefined {
    if (!key) return key;
    switch (key.toLowerCase()) {
    case 'completed':
    case 'current':
    case 'dropped':
    case 'on_hold':
    case 'planned':
      return key.toLowerCase();
    default:
      throw new Error(`Incorrect Status passed: ${key}`);
    }
  }

  constructor(
    accessToken: string = '',
    { clientId, clientSecret }: { clientId: string; clientSecret: string }
  ) {
    if (!isEmpty(accessToken)) {
      this.provider.headers.Authorization = `Bearer ${accessToken}`;
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
  public getToken(username: string, password: string): Promise<string> {
    if (isEmpty(this.clientId) || isEmpty(this.clientSecret)) {
      throw new Error('Missing clientId Or clientSecret');
    }
    const { owner } = new OAuth2({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      accessTokenUri: KitsuProvider.TokenURL
    });
    return owner
      .getToken(username, password)
      .then(({ accessToken }: { accessToken: string }) => {
        return accessToken;
      })
      .catch((err: any) => {
        console.error('There was an error getting a token %O', err);
        throw err;
      });
  }
  public refreshToken(): string {
    if (isEmpty(this.clientId) || isEmpty(this.clientSecret)) {
      throw new Error('Missing clientId Or clientSecret');
    }
    const { owner } = new OAuth2({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      accessTokenUri: KitsuProvider.TokenURL
    });

    return 'test';
  }
  public searchAnime(name: string): Promise<Anime[]> {
    return this.provider
      .get('anime', {
        filter: { text: name },
        fields: { anime: 'id,titles,episodeCount,posterImage' }
      })
      .then(({ data }: { data: any }) => {
        return data.map((entry: any) => {
          return this.outputNormalizeAnime(entry);
        });
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public getUserList(): Promise<listEntry[]> {
    return this.provider
      .self({ fields: { users: 'id' } })
      .then(({ id }: { id: number }) => {
        this.userId = id;
        return id;
      })
      .then((id: Number) =>
        this.provider.get('libraryEntries', {
          filter: { userId: id, kind: 'anime' },
          include: 'anime',
          page: {
            limit: 50
          },
          fields: {
            libraryEntries: 'id,progress,anime',
            anime: 'id,titles,episodeCount,posterImage'
          }
        })
      )
      .then(({ data }: { data: any }) => {
        return data.map((entry: any) => {
          return this.outputNormalizeListEntry(entry);
        });
      })
      .catch((err: any) => {
        throw err;
      });
  }
  // TODO: normalize responses
  public addAnime(variables: Partial<inputAnime>): Promise<any> {
    const params: kitsuAddEntryPayload = this.inputNormalizeAddAnime(variables);
    return this.provider.post('libraryEntries', { ...params });
  }
  public updateAnime(variables: Partial<inputAnime>): Promise<any> {
    const params: Partial<inputAnime> = this.inputNormalizeAnime(variables);
    return this.provider.patch('libraryEntries', { ...params });
  }
  public removeAnime(id: number): Promise<any> {
    return this.provider.delete('libraryEntries', id);
  }

  // helpers
  public outputNormalizeListEntry(entry: any): listEntry {
    const {
      id,
      anime,
      progress
    }: { id: number; anime: any; progress: number } = entry;
    const normalizedAnime = this.outputNormalizeAnime(anime);
    return { id, progress, anime: normalizedAnime };
  }
  public outputNormalizeAnime(anime: any): Anime {
    const {
      id,
      episodeCount,
      titles,
      posterImage
    }: {
      id: number;
      episodeCount: number;
      titles: any;
      posterImage: any;
    } = anime;
    return {
      id,
      TotalEpisodes: episodeCount,
      title: {
        romaji: titles.en_jp,
        english: titles.en
      },
      image: {
        medium: posterImage.tiny
      }
    };
  }
  public inputNormalizeAddAnime(input: Partial<inputAnime>): kitsuAddEntryPayload {
    const { status, progress, anime_id }: Partial<inputAnime> = input;
    return {
      status: KitsuProvider.Status(status),
      progress,
      anime: {
        id: anime_id.toString(),
        type: 'anime'
      },
      user: {
        id: this.userId.toString(),
        type: 'users'
      }
    };
  }
  public inputNormalizeAnime(input: Partial<inputAnime>): Partial<inputAnime> {
    const { id, status, progress, anime_id }: Partial<inputAnime> = input;
    const newType: Partial<inputAnime> = {
      anime_id,
      id,
      status: KitsuProvider.Status(status),
      progress
    };
    return pickBy(newType, identity);
  }
}

export default KitsuProvider;
