export interface PostedAnswer {
  questionId: number;
  itemId: number;
  other?: string;
}

export interface PostEventBody {
  answers: PostedAnswer[];
  userId: string;
  questionnairId: number;
}
