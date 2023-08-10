export type QuestionType = 'select' | 'radio' | 'check' | 'text';

export type QuestionTypeObject = { type: QuestionType; name: string };

export interface QuestionItem {
  id: number;
  name: string;
  isDiscription: boolean;
  isDeleted: boolean;
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
  sortId: number;
  questions: Question[];
}

export type QuestionResponse = (Question | GroupedQuestion)[];

export interface NewQuestionItem {
  name: string;
  isDiscription: boolean;
}

export interface NewQuestion {
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items: NewQuestionItem[];
  canInherit: boolean;
}

export interface ExistingQuestionItem {
  readonly id: number;
  name: string;
  isDiscription: boolean;
  isDeleted: boolean;
}

export interface ExistingQuestion {
  readonly id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items: (NewQuestionItem | ExistingQuestionItem)[];
  canInherit: boolean;
  isDeleted: boolean;
}
