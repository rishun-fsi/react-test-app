import { Inheritance } from './Inheritance';

export type QuestionType = 'select' | 'radio' | 'check' | 'text' | 'number';

export type QuestionTypeObject = { type: QuestionType; name: string };

export interface QuestionItem {
  id: number;
  name: string;
  isDescription: boolean;
  isDeleted: boolean;
}

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items?: QuestionItem[];
  isDeleted: boolean;
  canInherit: boolean;
  priority: number;
}

export interface GroupedQuestion {
  groupId: number;
  group: string;
  sortId: number;
  questions: Question[];
}

export type FetchedQuestion = Question | GroupedQuestion;

export interface QuestionResponse {
  questions: FetchedQuestion[];
  inheritance?: Inheritance;
}

export interface NewQuestionItem {
  name: string;
  isDescription: boolean;
}

export interface NewQuestion {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items?: NewQuestionItem[];
  canInherit: boolean;
}

export interface ExistingQuestionItem {
  readonly id: number;
  name: string;
  isDescription: boolean;
  isDeleted: boolean;
}

export interface ExistingQuestion {
  readonly id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items?: EditingQuestionItem[];
  canInherit: boolean;
  isDeleted: boolean;
}

export interface SendingQuestion {
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  canInherit: boolean;
  items?: NewQuestionItem[];
}

export type EditingQuestion = NewQuestion | ExistingQuestion;
export type EditingQuestionItem = NewQuestionItem | ExistingQuestionItem;

export type EditedQuestionItem = ExistingQuestionItem & {
  priority: number;
};

export type AddedQuestionItem = NewQuestionItem & { priority: number };

export interface EditedQuestion {
  id: number;
  type: QuestionType;
  required: boolean;
  headline: string;
  question: string;
  canInherit: boolean;
  isDeleted: boolean;
  priority: number;
  items?: {
    existing?: EditedQuestionItem[];
    new?: AddedQuestionItem[];
  };
}

export interface AddedQuestion {
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items?: AddedQuestionItem[];
  canInherit: boolean;
  priority: number;
}
