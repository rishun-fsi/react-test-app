import { DBInheritance } from './Inheritance';

type QuestionType = 'select' | 'radio' | 'check' | 'text' | 'number';

export interface FetchedQuestionType {
  id: number;
  type: QuestionType;
}

export interface DBQuestionnairMetadata {
  user_id: string; // 作成者
  name: string; // アンケート名
  created_date: Date; // 作成日
  updated_date: Date; // 更新日
}

// 設問の選択肢（insert）
export interface DBNewQuestionItem {
  question_id?: number; // 設問のID
  item_name: string; // 選択肢名
  is_description: boolean; // 記述式か否か
  priority: number; // 選択肢の表示順
}

// 設問の選択肢（update）
export interface DBExistingQuestionItem {
  id: number;
  item_name: string; // 選択肢名
  is_description: boolean; // 記述式か否か
  priority: number; // 選択肢の表示順
  is_deleted: boolean; // 削除された選択肢か否か
}

export interface DBUpdateQuestionItem {
  existing?: DBExistingQuestionItem[];
  new?: DBNewQuestionItem[];
}

// 設問（insert）
export interface DBNewQuestion {
  question: string; // 設問
  question_type_id: number; // 回答形式
  required: boolean; // 回答必須か否か
  headline?: string; // 見出し
  questionnair_id?: number; //アンケートID
  can_inherit?: boolean;
  priority: number;
  items?: DBNewQuestionItem[]; // 1つの質問の選択肢
}

// 設問（update）
export interface DBExistingQuestion {
  id: number;
  question: string; // 設問
  question_type_id: number; // 回答形式
  required: boolean; // 回答必須か否か
  headline?: string; // 見出し
  can_inherit: boolean;
  is_deleted: boolean;
  priority: number;
  items?: DBUpdateQuestionItem; // 1つの質問の選択肢
}

export interface DBQuestionnair {
  metadata: DBQuestionnairMetadata;
  inheritance?: DBInheritance;
  questions: DBNewQuestion[];
}

export interface DBUpdateQuestionnairMetadata {
  id: number;
  updated_date: Date;
  name?: string;
}

export interface DBUpdateQuestionnair {
  existing?: DBExistingQuestion[];
  new?: DBNewQuestion[];
  inheritance?: DBInheritance;
  metadata: DBUpdateQuestionnairMetadata;
}

export interface QuestionItem {
  id: number;
  name: string;
  isDescription: boolean;
  isDeleted: boolean;
}

export interface QuestionGroupByItem {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  headline: string;
  items?: QuestionItem[];
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
  items?: QuestionItem[];
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
  item_id?: number;
  item?: string;
  is_description?: boolean;
  group?: string;
  group_id?: number;
  is_question_deleted: boolean;
  is_item_deleted?: boolean;
  priority: number;
}
