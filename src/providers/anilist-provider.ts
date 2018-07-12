import { BasicProvider } from "../util/provider_interface";
import {
  Anime,
  listEntry,
  inputAnime,
  kitsuAddEntryPayload
} from "../util/types";
const Anilist = require('aniwrapper/node');
class AnilistProvider implements BasicProvider {
  provider: any;
  constructor(accessToken: string = "") {
    this.provider = new Anilist(accessToken);
  }
  getUserList() {
    return this.provider.getUserList();
  }
  searchAnime(name: string) {
    return this.provider.searchAnime(name);
  }
  updateAnime(vars: any) {
    return this.provider.updateAnime(vars);
  }
  removeAnime(id: any) {
    return this.provider.removeAnime(id);
  }
  addAnime(vars: any) {
    return this.provider.addAnime(vars);
  }
}
export default AnilistProvider;
