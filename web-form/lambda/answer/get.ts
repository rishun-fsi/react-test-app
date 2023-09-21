import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { formatDate } from './common';
import {
  GetResponse,
  GetResponseHeader,
  GetResponseAnswer,
  GetResponseAnswerPerQuestion,
  GetResponseItem
} from './interface/Response';
import {
  FetchedAnswerMetadata,
  FetchedHeader,
  FetchedAnswerPerQuestion
} from './interface/Answer';

const isInt = (x: any): boolean => {
  return typeof x === 'number' && x % 1 === 0;
};

const convertStringToNumber = (
  numberString: string,
  min: number,
  max?: number
): number => {
  const number = Number(numberString);
  if (number < min || !isInt(number) || (max !== undefined && number > max)) {
    throw new Error('不正なパラメータが指定されました。');
  }

  return number;
};

export const fetchHeaders = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number
): Promise<GetResponseHeader[]> => {
  const itemsQuery: string =
    'SELECT q.id, qt.question_type, q.headline FROM questions AS q INNER JOIN question_types as qt ON q.question_type_id = qt.id WHERE q.questionnair_id = $1 AND q.is_deleted IS FALSE ORDER BY q.priority;';

  const headers: GetResponseHeader[] = await db
    .any(itemsQuery, [questionnairId])
    .then((data) => {
      return formHeadersData(db, data);
    })
    .catch((error) => {
      throw error;
    });

  return headers;
};

export const formHeadersData = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  fetchedHeaders: FetchedHeader[]
): Promise<GetResponseHeader[]> => {
  const headers: GetResponseHeader[] = await Promise.all(
    fetchedHeaders.map(async (fetched: FetchedHeader) => {
      const items: GetResponseItem[] | undefined =
        fetched.question_type === 'check'
          ? await fetchItems(db, fetched.id)
          : undefined;
      return {
        id: fetched.id,
        name: fetched.headline,
        items
      };
    })
  );
  return headers;
};

const fetchItems = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionId: number
): Promise<GetResponseItem[]> => {
  const itemsQuery =
    'SELECT id, item_name AS name FROM question_items WHERE question_id = $1 AND is_deleted IS FALSE ORDER BY priority';
  const items: GetResponseItem[] = await db
    .any(itemsQuery, [questionId])
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return items;
};

export const fetchAnswerMetadata = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number,
  limit: number,
  offset: number
): Promise<FetchedAnswerMetadata[]> => {
  const answerMetadataQuery: string =
    'SELECT id, created_date, user_id, update_user, updated_date FROM answer_metadata WHERE questionnair_id = $1 AND is_deleted = FALSE ORDER BY id LIMIT $2 OFFSET $3;';

  const answerMetadata: FetchedAnswerMetadata[] = await db
    .any(answerMetadataQuery, [questionnairId, limit, offset])
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return answerMetadata;
};

const fetchTotalCount = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number
): Promise<number> => {
  const totalCountQuery =
    'SELECT COUNT(*) FROM answer_metadata WHERE questionnair_id = $1 AND is_deleted = FALSE;';

  const totalCount: number = await db
    .one(totalCountQuery, [questionnairId])
    .then((data) => {
      return Number(data.count);
    })
    .catch((error) => {
      throw error;
    });

  return totalCount;
};

export const formAnswersData = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  fetchedAnswers: FetchedAnswerMetadata[]
): Promise<GetResponseAnswer[]> => {
  const answers: GetResponseAnswer[] = await Promise.all(
    fetchedAnswers.map(async (fetched: FetchedAnswerMetadata) => {
      return {
        answer: await fetchAnswers(db, fetched.id),
        metadataId: fetched.id,
        answeredDate: formatDate(fetched.created_date),
        userId: fetched.user_id,
        updateUser: fetched.update_user,
        updatedDate: formatDate(fetched.updated_date)
      };
    })
  );
  return answers;
};

const fetchAnswers = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  metadataId: number
): Promise<GetResponseAnswerPerQuestion[]> => {
  const answersQuery: string =
    'SELECT a.question_id, a.item_id, qi.item_name, a.text_answer, qt.question_type FROM answers AS a ' +
    'LEFT JOIN question_items as qi ON a.item_id = qi.id ' +
    'INNER JOIN questions AS q ON a.question_id = q.id ' +
    'INNER JOIN question_types AS qt ON q.question_type_id = qt.id ' +
    'WHERE a.metadata_id = $1 ' +
    'ORDER BY a.id';
  const answers: GetResponseAnswerPerQuestion[] = await db
    .any(answersQuery, [metadataId])
    .then((data) => {
      return formAnswersPerQuestion(data);
    })
    .catch((error) => {
      throw error;
    });
  return answers;
};

const formAnswersPerQuestion = (
  fetchedAnswers: FetchedAnswerPerQuestion[]
): GetResponseAnswerPerQuestion[] => {
  const responseAnswersPerQuestion: GetResponseAnswerPerQuestion[] =
    fetchedAnswers.map((fetchedAnswer: FetchedAnswerPerQuestion) => {
      return {
        id: fetchedAnswer.question_id,
        itemId:
          fetchedAnswer.question_type === 'check'
            ? fetchedAnswer.item_id
            : undefined,
        itemName:
          fetchedAnswer.item_name !== null
            ? fetchedAnswer.item_name
            : undefined,
        textAnswer:
          fetchedAnswer.text_answer !== null
            ? fetchedAnswer.text_answer
            : undefined
      };
    });
  return responseAnswersPerQuestion;
};

export const fetchResponse = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number,
  limit: number,
  offset: number
): Promise<GetResponse> => {
  const headers: GetResponseHeader[] = await fetchHeaders(db, questionnairId);
  const answerMetadata: FetchedAnswerMetadata[] = await fetchAnswerMetadata(
    db,
    questionnairId,
    limit,
    offset
  );
  const answers: GetResponseAnswer[] = await formAnswersData(
    db,
    answerMetadata
  );

  const response: GetResponse = {
    headers: headers,
    answers: answers,
    totalCount: await fetchTotalCount(db, questionnairId)
  };
  return response;
};

export const createGetResponseBody = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  if (
    queryStringParameters!.questionnairId === undefined ||
    queryStringParameters!.limit === undefined ||
    queryStringParameters!.offset === undefined
  ) {
    const body = { message: '必要なパラメーターが指定されていません。' };
    return { statusCode: 400, body };
  }

  try {
    const questionnairId: number = convertStringToNumber(
      queryStringParameters.questionnairId,
      1
    );

    const limit: number = convertStringToNumber(
      queryStringParameters.limit,
      1,
      100
    );

    const offset: number = convertStringToNumber(
      queryStringParameters.offset,
      0
    );

    const response: GetResponse = await fetchResponse(
      db,
      questionnairId,
      limit,
      offset
    );

    const body = { message: 'success', ...response };
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
