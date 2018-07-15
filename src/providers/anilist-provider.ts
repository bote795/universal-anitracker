import { BasicProvider } from "../util/provider_interface";
import { isEmpty, get, pickBy, identity } from "lodash";
import {
  Anime,
  listEntry,
  inputAnime,
  AnilistAddEntryPayload,
  AnilistUpdateEntryPayload,
  AnilistMedia,
  anilisEntrysResponse
} from "../util/types";
const Anilist = require('aniwrapper/node');
class AnilistProvider implements BasicProvider {
  provider: any;
  constructor(accessToken: string = "") {
    this.provider = new Anilist(accessToken);
  }
  getUserList(): Promise<Array<listEntry>> {
    return this.provider
      .getUserList()
      .then(({ MediaListCollection }: { MediaListCollection: any }) =>
        get(MediaListCollection, "lists[0].entries")
      )
      .then((list: any) => {
        return list.map((entry: anilisEntrysResponse) =>
          this.outputNormalizeListEntry(entry)
        );
      });
  }
  searchAnime(name: string): Promise<Array<Anime>> {
    return this.provider
      .searchAnime(name)
      .then(({ AnimeSearch }: { AnimeSearch: any }) => {
        const data = get(AnimeSearch, "media");
        if (isEmpty(data)) {
          throw "Media entrys not found in search response";
        }
        return data.map((entry: any) => this.outputNormalizeAnime(entry));
      });
  }
  updateAnime(vars: Partial<inputAnime>): Promise<Partial<listEntry>> {
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
  removeAnime(id: Number): Promise<any> {
    return this.provider.removeAnime(id);
  }
  addAnime(vars: Partial<inputAnime>): Promise<any> {
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

  //helpers
  // ouput normalizers
  outputNormalizeListEntry(entry: anilisEntrysResponse): listEntry {
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
  outputNormalizeAnime(anime: AnilistMedia): Anime {
    return {
      id: anime.id,
      TotalEpisodes: anime.episodes,
      image: anime.coverImage,
      title: anime.title
    };
  }

  //input normalizers
  inputNormalizeAddAnime(input: Partial<inputAnime>): AnilistAddEntryPayload {
    const { status, progress, anime_id }: Partial<inputAnime> = input;
    return {
      mediaId: anime_id,
      status,
      progress
    };
  }
  inputNormalizeAnime(
    input: Partial<inputAnime>
  ): Partial<AnilistUpdateEntryPayload> {
    const { id, status, progress, anime_id }: Partial<inputAnime> = input;
    const newType: Partial<AnilistUpdateEntryPayload> = {
      mediaId: anime_id,
      id,
      status: status,
      progress
    };
    return pickBy(newType, identity);
  }
}
export default AnilistProvider;
