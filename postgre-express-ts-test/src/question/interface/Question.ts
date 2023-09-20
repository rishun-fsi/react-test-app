type QuestionType = 'select' | 'radio' | 'check' | 'text';

export interface QuestionItem {
  id: number;
  name: string;
  isDiscription: boolean;
  isDeleted: boolean;
}

export interface QuestionGroupByItem {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items: QuestionItem[];
  group?: string;
  groupId?: number;
  isDeleted: boolean;
  priority: number;
}

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items: QuestionItem[];
  isDeleted: boolean;
  priority: number;
}

export interface GroupedQuestion {
  groupId: number;
  group: string;
  questions: Question[];
}

export interface FetchedQuestion {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  item_id: number;
  item: string;
  is_discription: boolean;
  group?: string;
  group_id: number;
  is_question_deleted: boolean;
  is_item_deleted: boolean;
  priority: number;
}

export type GetResponse = (Question | GroupedQuestion)[];
