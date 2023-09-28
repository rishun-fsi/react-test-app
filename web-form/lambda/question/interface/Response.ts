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

export interface GetInheritanceResponse {
  isSameUser: boolean;
  questionId?: number;
}

export type GetQuestionResponse = (Question | GroupedQuestion)[];

export interface GetResponse {
  questions: GetQuestionResponse;
  inheritance?: GetInheritanceResponse;
}
