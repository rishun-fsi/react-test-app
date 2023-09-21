import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  insertAnswerMetadata,
  insertAnswersPerQuestion,
  updateMetadata,
  updateAnswersPerQuestion,
  deleteAnswersPerQuestion
} from './common';
import { ChunkPutEventBody, ChunkPutAnswer } from './interface/EventBody';
import { ChunkPutResponse } from './interface/Response';
import {
  UpdatingAnswer,
  AnswersForInsert,
  AnswersForUpdate,
  NewAnswer,
  DbAnswer,
  UpdatingDbAnswer
} from './interface/Answer';

const pgp = pgPromise({});

type ValidationResult = { isError: boolean; message?: string };

const validatePutAnswer = async (
  answers: ChunkPutAnswer[]
): Promise<ValidationResult> => {
  // ありえないデータ形式をしていないかをチェック
  if (
    answers.some(
      (putAnswer: ChunkPutAnswer) =>
        (putAnswer.existing === undefined &&
          putAnswer.new === undefined &&
          putAnswer.delete === undefined) ||
        (putAnswer.metadataId === undefined && putAnswer.new === undefined)
    )
  )
    return { isError: true, message: '不正なデータです。' };

  return { isError: false };
};

const createDataForUpdate = (
  eventBody: ChunkPutEventBody
): AnswersForUpdate => {
  const date: Date = new Date();
  const answers: UpdatingAnswer[] = eventBody.answers
    .filter((answer: ChunkPutAnswer) => answer.metadataId !== undefined)
    .map((answer: ChunkPutAnswer) => ({
      metadataId: answer.metadataId!,
      ...answer
    }));

  return {
    answers,
    questionnairId: eventBody.questionnairId,
    userId: eventBody.userId,
    date
  };
};

const createDataForInsert = (
  eventBody: ChunkPutEventBody
): AnswersForInsert => {
  const date: Date = new Date();
  const answers: NewAnswer[][] = eventBody.answers
    .filter((answer: ChunkPutAnswer) => answer.metadataId === undefined)
    .map((answer: ChunkPutAnswer) => answer.new!);

  return {
    answers,
    questionnairId: eventBody.questionnairId,
    userId: eventBody.userId,
    date
  };
};

const updateAnswers = async (
  answersForUpdate: AnswersForUpdate,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  await Promise.all(
    answersForUpdate.answers.map(async (answer: UpdatingAnswer) => {
      await updateMetadata(answersForUpdate.userId, answer.metadataId, t);

      if (answer.existing !== undefined) {
        const existingAnswers: UpdatingDbAnswer[] = answer.existing.map(
          (answer) => ({
            id: answer.answerId,
            item_id: answer.itemId,
            text_answer: answer.textAnswer
          })
        );
        await updateAnswersPerQuestion(existingAnswers, t);
      }
      if (answer.new !== undefined) {
        const newAnswers: DbAnswer[] = answer.new.map((answer: NewAnswer) => ({
          question_id: answer.questionId,
          item_id: answer.itemId,
          text_answer: answer.textAnswer
        }));
        await insertAnswersPerQuestion(newAnswers, answer.metadataId, t);
      }
      if (answer.delete !== undefined) {
        await deleteAnswersPerQuestion(answer.delete, t);
      }
    })
  );
};

const insertAnswers = async (
  answersForInsert: AnswersForInsert,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<number[]> => {
  const metadataIds: number[] = await Promise.all(
    answersForInsert.answers.map(async (newAnswers: NewAnswer[]) => {
      const metadataId: number = await insertAnswerMetadata(
        {
          created_date: answersForInsert.date,
          updated_date: answersForInsert.date,
          user_id: answersForInsert.userId,
          questionnair_id: answersForInsert.questionnairId
        },
        t
      );
      const answers: DbAnswer[] = newAnswers.map((answer: NewAnswer) => ({
        question_id: answer.questionId,
        item_id: answer.itemId,
        text_answer: answer.textAnswer
      }));

      await insertAnswersPerQuestion(answers, metadataId, t);
      return metadataId;
    })
  );
  return metadataIds;
};

const upsertAnswers = async (
  eventBody: ChunkPutEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<ChunkPutResponse> => {
  const answersForUpdate: AnswersForUpdate = createDataForUpdate(eventBody);
  const answersForInsert: AnswersForInsert = createDataForInsert(eventBody);

  const insertedIds: number[] = await db.tx(async (t) => {
    if (answersForUpdate.answers.length !== 0) {
      await updateAnswers(answersForUpdate, t);
    }
    const ids: number[] =
      answersForInsert.answers.length === 0
        ? []
        : await insertAnswers(answersForInsert, t);

    return ids;
  });
  const editedIds: number[] = answersForUpdate.answers.map(
    (answer: UpdatingAnswer) => answer.metadataId
  );

  return { message: 'success', edited: editedIds, inserted: insertedIds };
};

export const createChunkPutResponseBody = async (
  eventBody: ChunkPutEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: ChunkPutResponse }> => {
  const validationResult: ValidationResult = await validatePutAnswer(
    eventBody.answers
  );
  if (validationResult.isError)
    return { statusCode: 400, body: { message: validationResult.message! } };

  const response: ChunkPutResponse = await upsertAnswers(eventBody, db);
  return { statusCode: 200, body: response };
};
