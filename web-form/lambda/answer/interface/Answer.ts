export interface AnswerMetadata {
  created_date: Date;
  updated_date: Date;
  user_id: string;
  questionnair_id: number;
  id?: number;
}

export interface DbAnswer {
  question_id: number;
  item_id: number;
  other?: string;
  id?: number;
  metadata_id?: number;
}

export interface Answer {
  metadata: AnswerMetadata;
  answers: DbAnswer[];
}
