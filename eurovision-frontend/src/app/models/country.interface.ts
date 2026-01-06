import { Song } from './song.interface';

export interface Country {
  name: string;
  totalPoints: number;
  isUserCountry: boolean;
  song: Song;
}

