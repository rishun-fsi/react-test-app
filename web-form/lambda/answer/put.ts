import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { PutEventBody } from './interface/EventBody';
import {
  DbAnswer,
  UpdatingDbAnswer,
  UpsertingAnswer,
  ExistingAnswer,
  NewAnswer
} from './interface/Answer';
import { PutResponse } from './interface/Response';
import {
  formatDate,
  insertAnswersPerQuestion,
  updateAnswersPerQuestion,
  updateMetadata,
  deleteAnswersPerQuestion
} from './common';

const upsertAnswer = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  upsertingAnswer: UpsertingAnswer
): Promise<PutResponse> => {
  const upsertResult = await db
    .tx(async (t) => {
      if (upsertingAnswer.answers.existing !== undefined) {
        await updateAnswersPerQuestion(upsertingAnswer.answers.existing, t);
      }

      if (upsertingAnswer.answers.new !== undefined) {
        await insertAnswersPerQuestion(
          upsertingAnswer.answers.new,
          upsertingAnswer.metadataId,
          t
        );
      }

      const deleteIds: number[] =
        upsertingAnswer.answers.delete !== undefined
          ? await deleteAnswersPerQuestion(upsertingAnswer.answers.delete, t)
          : [];

      const updatedDate = await updateMetadata(
        upsertingAnswer.userId,
        upsertingAnswer.metadataId,
        t
      );

      return { updatedDate, deleteIds };
    })
    .then((data) => data)
    .catch((error) => {
      throw error;
    });

  return {
    userId: upsertingAnswer.userId,
    questionnairId: upsertingAnswer.questionnairId,
    updatedDate: formatDate(upsertResult.updatedDate),
    metadataId: upsertingAnswer.metadataId,
    deleteIds: upsertResult.deleteIds
  };
};

export const createPutResponseBody = async (
  eventBody: PutEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  const newAnswers: DbAnswer[] | undefined =
    eventBody.answers.new === undefined
      ? undefined
      : eventBody.answers.new.map(
          (answer: NewAnswer): DbAnswer => ({
            question_id: answer.questionId,
            item_id: answer.itemId,
            text_answer:
              answer.textAnswer === '' ? undefined : answer.textAnswer
          })
        );
  const existingAnswers: UpdatingDbAnswer[] | undefined =
    eventBody.answers.existing === undefined
      ? undefined
      : eventBody.answers.existing.map(
          (answer: ExistingAnswer): UpdatingDbAnswer => ({
            id: answer.answerId,
            item_id: answer.itemId,
            text_answer:
              answer.textAnswer === '' ? undefined : answer.textAnswer
          })
        );

  if (newAnswers === undefined && existingAnswers === undefined)
    return {
      statusCode: 400,
      body: { message: '不正なパラメータが指定されました。' }
    };

  const upsertingAnswer: UpsertingAnswer = {
    answers: {
      existing: existingAnswers,
      new: newAnswers,
      delete: eventBody.answers.delete
    },
    userId: eventBody.userId,
    questionnairId: eventBody.questionnairId,
    metadataId: eventBody.metadataId
  };

  const response = await upsertAnswer(db, upsertingAnswer);
  const body = { message: 'success', ...response };
  return { statusCode: 200, body };
};
