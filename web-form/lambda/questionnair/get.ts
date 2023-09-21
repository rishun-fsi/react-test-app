import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { formatDate } from './common';
import { GetResponse } from './interface/Response';
import { Questionnair } from './interface/Questionnair';

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

const convertStringToBoolean = (boolString?: string): boolean => {
  if (boolString === undefined || boolString === 'false') {
    return false;
  } else if (boolString === 'true') {
    return true;
  } else {
    throw new Error('不正なパラメータが指定されました。');
  }
};

const fetchQuestionnairs = async (
  limit: number,
  offset: number,
  isAll: boolean,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<GetResponse> => {
  const query: string = `SELECT * FROM questionnairs ${
    isAll ? '' : 'WHERE NOT is_deleted'
  } ORDER BY id LIMIT $1 OFFSET $2;`;
  const countQuery: string = `SELECT COUNT(*) FROM questionnairs ${
    isAll ? '' : 'WHERE NOT is_deleted'
  };`;

  const questionnairs: Questionnair[] = await db
    .any(query, [limit, offset])
    .then((data) => {
      return data.map((record) => ({
        id: record.id,
        userId: record.user_id,
        createdDate: formatDate(record.created_date),
        updatedDate: formatDate(record.updated_date),
        name: record.name,
        isDeleted: record.is_deleted
      }));
    })
    .catch((error) => {
      throw error;
    });
  const totalCount: number = await db
    .one(countQuery)
    .then((data) => Number(data.count))
    .catch((error) => {
      throw error;
    });

  return { questionnairs, totalCount };
};

export const createGetResponseBody = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  if (
    queryStringParameters.limit === undefined ||
    queryStringParameters.offset === undefined
  ) {
    const body = { message: '必要なパラメータが指定されていません。' };
    return { statusCode: 400, body };
  }

  try {
    const limit: number = convertStringToNumber(
      queryStringParameters.limit,
      1,
      100
    );
    const offset: number = convertStringToNumber(
      queryStringParameters.offset,
      0
    );
    const isAll: boolean = convertStringToBoolean(queryStringParameters.isAll);
    const response: GetResponse = await fetchQuestionnairs(
      limit,
      offset,
      isAll,
      db
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
