export interface Answer {
  questionId: number;
  itemId?: number;
  textAnswer?: string;
  answerId?: number;
}

export interface ExistingAnswer {
  answerId: number;
  itemId?: number;
  textAnswer?: string;
}

export interface AnswerMaster {
  answers: Answer[];
  userId: string;
  questionnairId: number;
}

export interface AnswerPostResponse {
  message: string;
  userId: string;
  questionnairId: number;
  metadataId: number;
  createdDate: Date;
}

export interface EditingAnswers {
  existing?: ExistingAnswer[];
  new?: Answer[];
  delete?: number[];
}

export interface AnswerMasterForEdit {
  answers: EditingAnswers;
  metadataId: number;
  userId: string;
  questionnairId: number;
}

export interface ValidatingAnswerPerQuestion {
  answerId: number;
  questionId: number;
  itemId?: number;
  textAnswer?: string;
}

export interface ValidatingAnswer {
  metadataId: number;
  questionnairId: number;
  userId: string;
  createdDate: string;
  updatedDate: string;
  updateUser?: string;
  answers: ValidatingAnswerPerQuestion[];
}

export type ChunkUpsertAnswer = {
  metadataId?: number;
} & EditingAnswers;

export interface ChunkUpsertAnswerRequest {
  userId: string;
  questionnairId: number;
  answers: ChunkUpsertAnswer[];
}
