import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { checkNumberFormat } from './common';
import { FetchedAnswer } from './interface/Answer';
import { Answer } from './interface/Response';

export const fetchAnswers = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  metadataId: number
): Promise<Answer[]> => {
  const answersPerMetadataQuery: string =
    'SELECT id AS answer_id, question_id, item_id, text_answer ' +
    'FROM answers WHERE metadata_id = $1 ' +
    'ORDER BY id';
  const answers: Answer[] = await db
    .any(answersPerMetadataQuery, [metadataId])
    .then((data) => {
      return formAnswers(data);
    })
    .catch((error) => {
      throw error;
    });
  return answers;
};

const formAnswers = (fetchedSelectedAnswers: FetchedAnswer[]) => {
  const responseSelectedAnswer: Answer[] = fetchedSelectedAnswers.map(
    (fetched: FetchedAnswer) => {
      return {
        answerId: fetched.answer_id,
        questionId: fetched.question_id,
        itemId: fetched.item_id === null ? undefined : fetched.item_id,
        textAnswer:
          fetched.text_answer === null ? undefined : fetched.text_answer
      };
    }
  );
  return responseSelectedAnswer;
};

export const createGetResponseBody = async (
  metadataId: number,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  try {
    checkNumberFormat(metadataId, 1);

    const response: Answer[] = await fetchAnswers(db, metadataId);
    const body = { message: 'success', answers: response };
    return { statusCode: 200, body };
  } catch (e) {
    if (
      e instanceof Error &&
      e.message === '不正なパラメータが指定されました。'
    ) {
      const body = { message: e.message };
      return { statusCode: 400, body };
    }

    console.error(e);
    return {
      statusCode: 500,
      body: { message: '予期せぬエラーが発生しました。' }
    };
  }
};
