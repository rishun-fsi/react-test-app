import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { formatDate } from './common';
import { GetResponse } from './interface/Response';
import { Notification } from '../notifications/interface/Notification';

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

const fetchNotifications = async (
  limit: number,
  offset: number,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<GetResponse> => {
  //const query: string = `SELECT * FROM notifications ORDER BY id LIMIT $1 OFFSET $2;`;

  const query: string = `SELECT notifications.*, notification_types.name  FROM notifications JOIN notification_types ON notification_types.id = notifications.type_id ORDER BY id LIMIT $1 OFFSET $2`;

  const notifications: Notification[] = await db
  .any(query, [limit, offset])
  // .then(async (data) => {
  //   const promises = data.map(async (record) => {
  //     const typeName = await db.one(`SELECT name FROM notification_types WHERE id = $1`, [record.type_id]);
  //     return {
  //       id: record.id,
  //       userId: record.user_id,
  //       title: record.title,
  //       createdDate: formatDate(record.created_date),
  //       updatedDate: record.updated_date ? formatDate(record.updated_date) : undefined,
  //       publishTimestamp: record.publish_timestamp ? record.publish_timestamp : undefined,
  //       expireTimestamp: record.expire_timestamp ? record.expire_timestamp : undefined,
  //       typeId: record.type_id,
  //       type: typeName.name,
  //     };
  //   });

  //   return Promise.all(promises);
  // })
  .then((data) => {
    return data.map((record) => ({
        id: record.id,
        userId: record.user_id,
        title: record.title,
        createdDate: formatDate(record.created_date),
        updatedDate: record.updated_date ? formatDate(record.updated_date) : undefined,
        publishTimestamp: record.publish_timestamp ? record.publish_timestamp : undefined,
        expireTimestamp: record.expire_timestamp ? record.expire_timestamp : undefined,
        typeId: record.type_id,
        type: record.name,
    }));
  })
  .catch((error) => {
    throw error;
  });

  return { notifications };
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
    const response: GetResponse = await fetchNotifications(
      limit,
      offset,
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
