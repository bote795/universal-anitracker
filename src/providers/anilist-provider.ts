import { BasicProvider } from "../util/provider_interface";
import { get, pickBy, identity } from "lodash";
import {
  Anime,
  listEntry,
  inputAnime,
  AnilistAddEntryPayload,
  AnilistUpdateEntryPayload,
  AnilistMedia
} from "../util/types";
const Anilist = require('aniwrapper/node');
class AnilistProvider implements BasicProvider {
  provider: any;
  constructor(accessToken: string = "") {
    this.provider = new Anilist(accessToken);
  }
  getUserList() {
    MediaListCollection.lists[0].entries;
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
  searchAnime(name: string) {
    return this.provider.searchAnime(name);
  }
  updateAnime(vars: Partial<inputAnime>) {
    const params: Partial<AnilistUpdateEntryPayload> = this.inputNormalizeAnime(
      vars
    );
    return this.provider.updateAnime(params);
  }
  removeAnime(id: Number) {
    return this.provider.removeAnime(id);
  }
  addAnime(vars: Partial<inputAnime>) {
    const params = this.inputNormalizeAddAnime(vars);
    return this.provider.addAnime(params);
  }

  //helpers
  // ouput normalizers
  outputNormalizeListEntry(entry: anilisEntrysResponse): listEntry {
    const { id, progress, mediaId, media }:
    { id: Number, progress: Number, mediaId :Number, media:AnilistMedia }
      = entry;
    return {
      id,
      progress,
      anime: {
        id: mediaId,
        TotalEpisodes: media.episodes,
        image: media.coverImage,
        title: media.title
      }
    }
  }
  outputNormalizeAnime(anime: any): Anime {}

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
