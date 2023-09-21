import { Question, GroupedQuestion } from './Question';

export interface PostResponse {
  userId: string;
  questionnairId: number;
  createdDate: Date;
  name: string;
}

export interface PutResponse {
  questionnairId: number;
  updatedDate: Date;
  name?: string;
}

export type GetResponse = (Question | GroupedQuestion)[];
