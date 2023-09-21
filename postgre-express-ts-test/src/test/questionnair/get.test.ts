import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { connectDB } from '../../answer/db';
import { createGetResponseBody } from '../../questionnair/get';
import { GetResponse } from '../../questionnair/interface/Response';
import { Questionnair } from '../../questionnair/interface/Questionnair';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('正常にデータが取得できること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '2',
      offset: '0',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string } & GetResponse;
    expect(response.statusCode).toBe(200);
    expect(body.message).toBe('success');
    expect(body.questionnairs.length).toBe(2);
    expect(body.questionnairs[0]).toEqual({
      id: 1,
      name: 'PJ健康診断アンケート',
      createdDate: '2023-07-21',
      updatedDate: '2023-07-21',
      isDeleted: false,
      userId: 'test'
    });
    expect(typeof body.totalCount).toBe('number');
  });

  test('isAllがtrueだと削除済みアンケートも取得できること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '3',
      offset: '0',
      isAll: 'true'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string } & GetResponse;
    expect(response.statusCode).toBe(200);
    expect(body.questionnairs[2].isDeleted).toBe(true);
  });

  test('isAllを指定しない場合は削除済みアンケートは取得しないこと', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '3',
      offset: '0'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string } & GetResponse;
    expect(response.statusCode).toBe(200);
    body.questionnairs.map((questionnair: Questionnair) => {
      expect(questionnair.isDeleted).toBe(false);
    });
  });

  test('limitを制限するとその数だけアンケートが取得できること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '1',
      offset: '0',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string } & GetResponse;
    expect(response.statusCode).toBe(200);
    expect(body.questionnairs.length).toBe(1);
  });

  test('offsetを指定すると指定した番号からデータを取得すること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '1',
      offset: '1',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string } & GetResponse;
    expect(response.statusCode).toBe(200);
    expect(body.questionnairs[0].id).toBe(2);
  });
});
describe('準正常系', () => {
  test('limitに0以下の数字を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '0',
      offset: '0',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('limitに100以上の数字を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '101',
      offset: '0',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('offsetに0未満の数字を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '2',
      offset: '-1',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('limitに数字以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: 'aaa',
      offset: '0',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('offsetに数字以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '2',
      offset: 'bbb',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('isAllにtrue/false以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '2',
      offset: '0',
      isAll: 'ccc'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('limitを指定しないと必要なパラメータが指定されていないと判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      offset: '0',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('必要なパラメータが指定されていません。');
  });

  test('offsetを指定しないと必要なパラメータが指定されていないと判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '2',
      isAll: 'false'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('必要なパラメータが指定されていません。');
  });
});
