export interface listEntry {
  id: number;
  progress: number;
  anime: Anime;
}

export interface Anime {
  id: number;
  TotalEpisodes: number;
  image: CoverImage;
  title: title;
}
export interface CoverImage{
  medium: string;
}

export interface title {
  romaji: string;
  english: string;
}

export interface inputAnime {
  id: number | undefined;
  status: string | undefined;
  progress: number | undefined;
  anime_id: number | undefined;
}

export interface kitsuAddEntryPayload {
  status: string | undefined;
  progress: number | undefined;
  anime: relationshipType;
  user: relationshipType;
}

export interface anilisEntrysResponse {
  id: number;
  mediaId: number;
  progress: number;
  media: AnilistMedia;
}

export interface AnilistMedia {
  id: number;
  episodes: number;
  coverImage: CoverImage;
  title: title;
}
export interface AnilistAddEntryPayload {
  mediaId: number ;
  status: string;
  progress: number ;
}

export interface AnilistUpdateEntryPayload {
  id: number | undefined;
  mediaId: number | undefined;
  status: string | undefined;
  progress: number | undefined;
}


export interface relationshipType {
  id: string;
  type: string;
}
