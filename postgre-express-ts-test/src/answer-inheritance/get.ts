import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { checkNumberFormat } from './common';
import { Answer, FetchedAnswer } from './interface/Answer';
import { GetResponse } from './interface/Response';

const fetchAnswers = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  metadataId: number
): Promise<Answer[]> => {
  const answersPerMetadataQuery: string =
    'SELECT a.question_id, a.item_id, a.text_answer FROM answers AS a ' +
    'INNER JOIN questions AS q ON a.question_id = q.id ' +
    'WHERE a.metadata_id = $1 AND q.can_inherit IS TRUE ' +
    'ORDER BY q.priority';
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

const formAnswers = (fetchedSelectedAnswers: FetchedAnswer[]): Answer[] => {
  const responseSelectedAnswer: Answer[] = fetchedSelectedAnswers.map(
    (fetched: FetchedAnswer) => {
      return {
        questionId: fetched.question_id,
        itemId: fetched.item_id === null ? undefined : fetched.item_id,
        textAnswer:
          fetched.text_answer === null ? undefined : fetched.text_answer
      };
    }
  );
  return responseSelectedAnswer;
};

const createQuery = (userId?: string, answer?: Answer): string => {
  const selectClause: string =
    'SELECT am.id FROM answer_metadata AS am INNER JOIN answers AS a ON am.id = a.metadata_id';
  const conditions: string[] = [
    'am.questionnair_id = $1',
    userId !== undefined ? 'am.user_id = $2' : '',
    answer !== undefined ? 'a.question_id = $3' : '',
    answer !== undefined && answer.itemId !== undefined ? 'a.item_id = $4' : '',
    answer !== undefined && answer.textAnswer !== undefined
      ? 'a.text_answer = $5'
      : ''
  ];

  const query: string = `${selectClause} WHERE ${conditions
    .filter((condition: string) => condition !== '')
    .join(' AND ')} ORDER BY created_date DESC LIMIT 1;`;

  return query;
};

const fetchAnswerMetadataId = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number,
  userId?: string,
  answer?: Answer
): Promise<number | undefined> => {
  const query: string = createQuery(userId, answer);

  const dataForPlaceholder: any[] = [
    questionnairId,
    userId,
    answer !== undefined ? answer.questionId : undefined,
    answer !== undefined ? answer.itemId : undefined,
    answer !== undefined ? answer.textAnswer : undefined
  ];
  try {
    const metadataId: number = await db
      .one(query, dataForPlaceholder)
      .then((record) => record.id);

    return metadataId;
  } catch (e) {
    if ((e as Error).message === 'No data returned from the query.')
      return undefined;
    throw e;
  }
};

export const createGetResponseBody = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number,
  userId?: string,
  answer?: Answer
): Promise<{ statusCode: number; body: GetResponse }> => {
  try {
    checkNumberFormat(questionnairId, 1);
    if (answer) {
      checkNumberFormat(answer.questionId, 1);
    }
    if (answer && answer.itemId) {
      checkNumberFormat(answer.itemId, 1);
    }

    const metadataId: number | undefined = await fetchAnswerMetadataId(
      db,
      questionnairId,
      userId,
      answer
    );
    if (metadataId === undefined)
      return {
        statusCode: 404,
        body: { message: '過去の回答がありませんでした。' }
      };
    const answers: Answer[] = await fetchAnswers(db, metadataId);
    const body = { message: 'success', answers };
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
