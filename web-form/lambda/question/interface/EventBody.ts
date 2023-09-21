export interface PostedInheritance {
  isSameUser: boolean;
  questionIndex?: number;
}

export interface PostedQuestionItem {
  name: string;
  isDescription: boolean;
}

export interface PostedQuestion {
  question: string;
  type: string;
  required: boolean;
  headline: string;
  canInherit: boolean;
  items?: PostedQuestionItem[];
}

export interface PostEventBody {
  userId: string;
  name: string;
  inheritance?: PostedInheritance;
  questions: PostedQuestion[];
}

export interface PutExistingQuestionItem {
  id: number;
  name: string;
  isDescription: boolean;
  priority: number;
  isDeleted: boolean;
}

export interface PutNewQuestionItem {
  name: string;
  isDescription: boolean;
  priority: number;
}

export interface PutQuestionItem {
  existing?: PutExistingQuestionItem[];
  new?: PutNewQuestionItem[];
}

export interface PutNewQuestion {
  type: string;
  question: string;
  required: boolean;
  headline: string;
  canInherit: boolean;
  priority: number;
  items?: PutNewQuestionItem[];
}

export interface PutExistingQuestion {
  id: number;
  type: string;
  question: string;
  required: boolean;
  headline: string;
  canInherit: boolean;
  isDeleted: boolean;
  priority: number;
  items?: PutQuestionItem;
}

export interface PutInheritance {
  isSameUser: boolean;
  questionId?: number;
  questionIndex?: number;
}

export interface PutEventBody {
  existing?: PutExistingQuestion[];
  new?: PutNewQuestion[];
  inheritance?: PutInheritance;
  questionnairName?: string;
  questionnairId: number;
}
