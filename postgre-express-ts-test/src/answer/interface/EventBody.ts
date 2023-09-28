import { NewAnswer, ExistingAnswer } from './Answer';

export interface PostEventBody {
  answers: NewAnswer[];
  userId: string;
  questionnairId: number;
}

export interface PutAnswers {
  existing?: ExistingAnswer[];
  new?: NewAnswer[];
  delete?: number[];
}

export interface PutEventBody {
  answers: PutAnswers;
  userId: string;
  questionnairId: number;
  metadataId: number;
}

export interface DeleteEventBody {
  metadataIds: number[];
  userId: string;
  questionnairId: number;
}

export interface ChunkPutAnswer {
  metadataId?: number;
  existing?: ExistingAnswer[];
  new?: NewAnswer[];
  delete?: number[];
}

export interface ChunkPutEventBody {
  answers: ChunkPutAnswer[];
  userId: string;
  questionnairId: number;
}
