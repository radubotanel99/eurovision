import { ResultVotesDTO } from './result-votes-dto.interface';

export interface CountryVotesDTO {
  countryName: string;
  votes: ResultVotesDTO[];
}

