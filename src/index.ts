import KitsuProvider from "./providers/kitsu-provider";
import AnilistProvider from "./providers/anilist-provider";
import { isEmpty, get } from "lodash";
import { listEntry } from "./util/types";

const dotenv = require("dotenv"); // eslint-disable-line
dotenv.config();
const opts = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};
const USERNAME = process.env.EMAIL || "";
const PASSWORD = process.env.PASSWORD || "";
const TOKEN    = process.env.TOKEN || "";

const provider: KitsuProvider = new KitsuProvider(TOKEN, opts);
const main = async () => {
    try {
          if (isEmpty(TOKEN)) {
            const token = await provider.getToken(USERNAME, PASSWORD);
            console.log("this is the token", token);
          }
          const searchAnime = await provider.searchAnime("naruto");
          console.log("this is the searchAnime length %d", searchAnime.length);
          console.log("this is the searchAnime %O", searchAnime);

          const list = await provider.getUserList();
          console.log("this is the list size %d", list.length);
          console.log("this is the list %O", list);
          const animes = list.map((entry: listEntry) => entry.anime);
          console.log("this is the list of anime %O", animes);

          const item = list.find((entry:any) => entry.anime.id ==='13209');
          console.log('this is the itme: ', item);
        var data;
          //id: 30988562
          //black clover id: 13209
        data = await provider.updateAnime({
            id: item.id,
            progress: 32
        });
        console.log("This is the response %O", data);

        data = await provider.removeAnime(item.id);
        console.log("This is the response %O", data);


        data = await provider.addAnime({
          anime_id: get(item, 'anime.id',13209),
            progress: 32,
            status: 'current'
        });
        console.log("This is the response %O", data);
        } catch (error) {
        console.warn("There was an error, %O", error)
    }

};

main();
