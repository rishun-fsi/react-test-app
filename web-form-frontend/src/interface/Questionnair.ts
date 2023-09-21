import { EditedQuestion, AddedQuestion, SendingQuestion } from './Question';

export interface Questionnair {
  userId: string;
  name: string;
  inheritance?: Inheritance;
  questions: SendingQuestion[];
}

export interface Inheritance {
  isSameUser: boolean;
  questionIndex?: number;
  questionId?: number;
}

export interface QuestionnairMetaData {
  id: number;
  userId: string;
  createdDate: string;
  updatedDate: string;
  name: string;
  isDeleted: boolean;
}

export interface QuestionnairGetResponse {
  questionnairs: QuestionnairMetaData[];
  totalCount: number;
}

export interface EditedQuestionnair {
  questionnairId: number;
  existing?: EditedQuestion[];
  new?: AddedQuestion[];
  inheritance?: Inheritance;
  questionnairName?: string;
}
