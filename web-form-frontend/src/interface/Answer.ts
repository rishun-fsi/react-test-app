export interface Answer {
  questionId: number;
  itemId: number;
  other?: string;
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
