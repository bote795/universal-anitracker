import { BasicProvider } from '../util/provider_interface';
import { isEmpty, get, pickBy, identity } from 'lodash';
import {
  Anime,
  listEntry,
  inputAnime,
  AnilistAddEntryPayload,
  AnilistUpdateEntryPayload,
  AnilistMedia,
  anilisEntrysResponse
} from '../util/types';
const Anilist = require('aniwrapper/node');
class AnilistProvider implements BasicProvider {
  public provider: any;

  public static Status(key: string): string | undefined {
    if (!key) return key;
    switch (key.toLowerCase()) {
    case 'current':
    case 'planning':
    case 'completed':
    case 'dropped':
    case 'paused':
    case 'repeating':
      return key.toUpperCase();
    default:
      throw new Error(`Incorrect Status passed: ${key}`);
    }
  }

  constructor(accessToken: string = '') {
    this.provider = new Anilist(accessToken);
  }
  public getUserList(): Promise<listEntry[]> {
    return this.provider
      .getUserList()
      .then(({ MediaListCollection }: { MediaListCollection: any }) =>
        get(MediaListCollection, 'lists[0].entries')
      )
      .then((list: any) => {
        return list.map((entry: anilisEntrysResponse) =>
          this.outputNormalizeListEntry(entry)
        );
      });
  }
  public searchAnime(name: string): Promise<Anime[]> {
    return this.provider
      .searchAnime(name)
      .then(({ AnimeSearch }: { AnimeSearch: any }) => {
        const data = get(AnimeSearch, 'media');
        if (isEmpty(data)) {
          throw new Error('Media entrys not found in search response');
        }
        return data.map((entry: any) => this.outputNormalizeAnime(entry));
      });
  }
  public updateAnime(vars: Partial<inputAnime>): Promise<Partial<listEntry>> {
    const params: Partial<AnilistUpdateEntryPayload> = this.inputNormalizeAnime(
      vars
    );
    return this.provider
      .updateAnime(params)
      .then(({ SaveMediaListEntry }: { SaveMediaListEntry: any }) => {
        const { id, mediaId, status, progress } = SaveMediaListEntry;
        return {
          id,
          status,
          progress,
          anime: {
            id: mediaId
          }
        };
      });
  }
  public removeAnime(id: number): Promise<any> {
    return this.provider.removeAnime(id);
  }
  public addAnime(vars: Partial<inputAnime>): Promise<Partial<listEntry>> {
    const params = this.inputNormalizeAddAnime(vars);
    return this.provider
      .addAnime(params)
      .then(({ SaveMediaListEntry }: { SaveMediaListEntry: any }) => {
        const { id, mediaId, status, progress } = SaveMediaListEntry;
        return {
          id,
          status,
          progress,
          anime: {
            id: mediaId
          }
        };
      });
  }

  // helpers
  // ouput normalizers
  public outputNormalizeListEntry(entry: anilisEntrysResponse): listEntry {
    const {
      id,
      progress,
      mediaId,
      media
    }: {
      id: number;
      progress: number;
      mediaId: number;
      media: AnilistMedia;
    } = entry;
    return {
      id,
      progress,
      anime: this.outputNormalizeAnime(media)
    };
  }
  public outputNormalizeAnime(anime: AnilistMedia): Anime {
    return {
      id: anime.id,
      TotalEpisodes: anime.episodes,
      image: anime.coverImage,
      title: anime.title
    };
  }

  // input normalizers
  public inputNormalizeAddAnime(input: Partial<inputAnime>): AnilistAddEntryPayload {
    const { status, progress, anime_id }: Partial<inputAnime> = input;
    return {
      mediaId: anime_id,
      status: AnilistProvider.Status(status),
      progress
    };
  }
  public inputNormalizeAnime(
    input: Partial<inputAnime>
  ): Partial<AnilistUpdateEntryPayload> {
    const { id, status, progress, anime_id }: Partial<inputAnime> = input;
    const newType: Partial<AnilistUpdateEntryPayload> = {
      mediaId: anime_id,
      id,
      status: AnilistProvider.Status(status),
      progress
    };
    return pickBy(newType, identity);
  }
}
export default AnilistProvider;
