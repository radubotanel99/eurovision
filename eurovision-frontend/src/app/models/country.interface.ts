import { Song } from './song.interface';

export interface Country {
  name: string;
  totalPoints: number;
  userCountry: boolean;
  song: Song;
}

