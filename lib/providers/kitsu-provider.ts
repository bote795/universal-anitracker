import { BasicProvider } from '../@types/provider_interface';
import { isEmpty, pickBy, identity } from 'lodash';
import {
  Anime,
  ListEntry,
  KitsuAddEntryPayload,
  ProviderAnime,
} from '../@types/types';
/* tslint:disable:no-var-requires */
const Kitsu = require('kitsu/node');
const OAuth2 = require('client-oauth2');
/* tslint:enable:no-var-requires */

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
      accessTokenUri: KitsuProvider.TokenURL,
    });
    return owner
      .getToken(username, password)
      .then(({ accessToken }: { accessToken: string }) => {
        this.provider.headers.Authorization = `Bearer ${accessToken}`;
        return accessToken;
      })
      .catch((err: any) => {
        /* tslint:disable:no-console */
        console.error('There was an error getting a token %O', err);
        /* tslint:enable:no-console */

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
      accessTokenUri: KitsuProvider.TokenURL,
    });

    return 'test';
  }
  public searchAnime(name: string): Promise<Anime[]> {
    return this.provider
      .get('anime', {
        filter: { text: name },
        fields: { anime: 'id,titles,episodeCount,posterImage' },
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

  public getUserList(): Promise<ListEntry[]> {
    return this.provider
      .self({ fields: { users: 'id' } })
      .then(({ id }: { id: number }) => {
        this.userId = id;
        return id;
      })
      .then((id: number) =>
        this.provider.get('libraryEntries', {
          filter: { userId: id, kind: 'anime' },
          include: 'anime',
          page: {
            limit: 50,
          },
          fields: {
            libraryEntries: 'id,progress,anime',
            anime: 'id,titles,episodeCount,posterImage',
          },
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
  public addAnime(variables: ProviderAnime): Promise<any> {
    const params: KitsuAddEntryPayload = this.inputNormalizeAddAnime(variables);
    return this.provider
      .post('libraryEntries', { ...params })
      .then(({ data }: { data: any }) => {
        return {
          id: data.id,
          status: data.attributes.status,
          progress: data.attributes.progress,
        };
      });
  }
  public updateAnime(variables: ProviderAnime): Promise<any> {
    const params: ProviderAnime = this.inputNormalizeAnime(variables);
    return this.provider
      .patch('libraryEntries', { ...params })
      .then(({ data }: { data: any }) => {
        return {
          id: data.id,
          status: data.attributes.status,
          progress: data.attributes.progress,
        };
      });
  }
  public removeAnime(id: number): Promise<any> {
    return this.provider.delete('libraryEntries', id);
  }

  // helpers
  public outputNormalizeListEntry(entry: any): ListEntry {
    const {
      id,
      anime,
      progress,
    }: { id: number; anime: any; progress: number } = entry;
    const normalizedAnime = this.outputNormalizeAnime(anime);
    return { id, progress, anime: normalizedAnime };
  }
  public outputNormalizeAnime(anime: any): Anime {
    const {
      id,
      episodeCount,
      titles,
      posterImage,
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
        english: titles.en,
      },
      image: {
        medium: posterImage.tiny,
      },
    };
  }
  public inputNormalizeAddAnime(input: ProviderAnime): KitsuAddEntryPayload {
    const { status, progress, anime_id }: ProviderAnime = input;
    return {
      status: KitsuProvider.Status(status),
      progress,
      anime: {
        id: anime_id.toString(),
        type: 'anime',
      },
      user: {
        id: this.userId.toString(),
        type: 'users',
      },
    };
  }
  public inputNormalizeAnime(input: ProviderAnime): ProviderAnime {
    const { id, status, progress, anime_id }: ProviderAnime = input;
    const newType: ProviderAnime = {
      anime_id,
      id,
      status: KitsuProvider.Status(status),
      progress,
    };
    return pickBy(newType, identity);
  }
}

export default KitsuProvider;
