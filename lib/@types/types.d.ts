import AnilistProvider from "../providers/anilist-provider";
import KitsuProvider from "../providers/kitsu-provider";

// EXTERNAL types
export type universalTrackerProvider = AnilistProvider | KitsuProvider;

export type AnimeEntry = Partial<ListEntry>;
export interface ListEntry {
  id: number;
  progress: number;
  anime: Anime;
}

export interface Anime {
  id: number;
  TotalEpisodes: number;
  image: CoverImage;
  title: Title;
}
export interface CoverImage {
  medium: string;
}

export interface Title {
  romaji: string;
  english: string;
}

export type ProviderAnime = Partial<InputAnime>;

export interface InputAnime {
  id: number | undefined;
  status: string | undefined;
  progress: number | undefined;
  anime_id: number | undefined;
}

// INTERNAL types
export interface KitsuAddEntryPayload {
  status: string | undefined;
  progress: number | undefined;
  anime: RelationshipType;
  user: RelationshipType;
}

export interface AnilisEntrysResponse {
  id: number;
  mediaId: number;
  progress: number;
  media: AnilistMedia;
}

export interface AnilistMedia {
  id: number;
  episodes: number;
  coverImage: CoverImage;
  title: Title;
}
export interface AnilistAddEntryPayload {
  mediaId: number;
  status: string;
  progress: number;
}

export interface AnilistUpdateEntryPayload {
  id: number | undefined;
  mediaId: number | undefined;
  status: string | undefined;
  progress: number | undefined;
}

export interface RelationshipType {
  id: string;
  type: string;
}
