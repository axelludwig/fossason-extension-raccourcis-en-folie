export interface Channel {
  name: string,
  id: string,
  members: Member[]
}

export interface Member {
  id: string,
  name: string
}

export interface soundRenamedSocketResponse {
  id: number;
  newName: string;
}

export interface queueItem {
  name: string;
  id: string;
}

export interface Base64File {
  data: string;
  id: string;
  name: string;
}

export interface Sound {
  ID: number;
  Name: string;
  SoundLength: number;
  User: string;
  PublicationDate: Date;
  Tags: Tag[];
}

export interface Tag {
  ID: number;
  Name: string;
  Selected?: boolean;
  IsFavorite?: boolean;
}

export interface YoutubeSearchLink {
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  duration: number;
}