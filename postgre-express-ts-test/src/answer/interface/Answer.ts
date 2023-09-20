export interface AnswerMetadata {
  created_date: Date;
  updated_date: Date;
  user_id: string;
  questionnair_id: number;
  id?: number;
}

export interface DbAnswer {
  question_id: number;
  item_id?: number;
  text_answer?: string;
  id?: number;
  metadata_id?: number;
}

export interface UpdatingDbAnswer {
  id: number;
  item_id?: number;
  text_answer?: string;
}

export interface Answer {
  metadata: AnswerMetadata;
  answers: DbAnswer[];
}

export interface FetchedAnswerMetadata {
  id: number;
  created_date: Date;
  user_id: string;
  update_user: string;
  updated_date: Date;
}

export interface FetchedAnswerPerQuestion {
  question_id: number;
  item_id: number;
  item_name: string;
  text_answer: string;
  question_type: string;
}

export interface FetchedHeader {
  id: number;
  headline: string;
  question_type: string;
}

export interface NewAnswer {
  questionId: number;
  itemId?: number;
  textAnswer?: string;
}

export interface ExistingAnswer {
  answerId: number;
  itemId?: number;
  textAnswer?: string;
}

export interface UpsertingAnswer {
  answers: {
    existing?: UpdatingDbAnswer[];
    new?: DbAnswer[];
    delete?: number[];
  };
  userId: string;
  questionnairId: number;
  metadataId: number;
}

export interface UpdatingAnswer {
  metadataId: number;
  existing?: ExistingAnswer[];
  new?: NewAnswer[];
  delete?: number[];
}

export interface AnswersForUpdate {
  answers: UpdatingAnswer[];
  questionnairId: number;
  userId: string;
  date: Date;
}

export interface AnswersForInsert {
  answers: NewAnswer[][];
  questionnairId: number;
  userId: string;
  date: Date;
}
