import { Answer } from './Answer';

export interface GetResponse {
  message: string;
  answers?: Answer[];
}
