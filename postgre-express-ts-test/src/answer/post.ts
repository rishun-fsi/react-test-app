import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { insertAnswerMetadata, insertAnswersPerQuestion } from './common';
import { Answer, NewAnswer, DbAnswer } from './interface/Answer';
import { PostEventBody } from './interface/EventBody';
import { PostResponse } from './interface/Response';

const pgp = pgPromise({});

export const createAnswer = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  answer: Answer
): Promise<PostResponse> => {
  const id = await db.tx(async (t) => {
    const metadataId = await insertAnswerMetadata(answer.metadata, t);
    await insertAnswersPerQuestion(answer.answers, metadataId, t);

    return metadataId;
  });

  return {
    userId: answer.metadata.user_id,
    questionnairId: answer.metadata.questionnair_id,
    createdDate: answer.metadata.created_date,
    metadataId: id
  };
};

export const createPostResponseBody = async (
  eventBody: PostEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  const date = new Date();
  const answersPerQuestion: DbAnswer[] = eventBody.answers.map(
    (answer: NewAnswer): DbAnswer => ({
      question_id: answer.questionId,
      item_id: answer.itemId,
      text_answer: answer.textAnswer === '' ? undefined : answer.textAnswer
    })
  );
  const answer: Answer = {
    metadata: {
      created_date: date,
      updated_date: date,
      user_id: eventBody.userId,
      questionnair_id: eventBody.questionnairId
    },
    answers: answersPerQuestion
  };

  const response = await createAnswer(db, answer);
  const body = { message: 'success', ...response };
  return { statusCode: 200, body };
};
