import { QuestionType } from './Question';

export type HeaderForFormat = {
  id: number;
  header: string;
  type: QuestionType;
  itemId?: number;
  isDescription?: boolean;
};
