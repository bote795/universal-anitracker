export interface listEntry {
  id: Number;
  progress: Number;
  anime: Anime;
}

export interface Anime {
  id: Number;
  TotalEpisodes: Number;
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
export interface relationshipType {
  id: string;
  type: string;
}
