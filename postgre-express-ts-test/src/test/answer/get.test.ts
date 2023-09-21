import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { fetchResponse, createGetResponseBody } from '../../answer/get';
import { connectDB } from '../../answer/db';
import { GetResponse } from '../../answer/interface/Response';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('回答一覧を正常に取得する場合', async () => {
    const response: GetResponse = await fetchResponse(db, 1, 2, 0);
    expect(response.headers[0]).toEqual({
      id: 1,
      name: 'システム名'
    });
    expect(response.headers[1]).toEqual({
      id: 2,
      name: '開発手法'
    });
    expect(response.headers[2]).toEqual({
      id: 3,
      name: 'サーバーの土台',
      items: [
        {
          id: 6,
          name: 'AWS'
        },
        {
          id: 7,
          name: 'GCP'
        },
        {
          id: 8,
          name: 'Azure'
        },
        {
          id: 9,
          name: 'ドコモ内オンプレ'
        },
        {
          id: 10,
          name: 'その他'
        }
      ]
    });
    expect(response.headers[3]).toEqual({
      id: 4,
      name: '変更のリードタイム'
    });

    expect(response.answers[0]).toEqual({
      answer: [
        {
          id: 1,
          itemName: 'システムA'
        },
        {
          id: 2,
          itemName: 'アジャイル'
        },
        {
          id: 3,
          itemId: 6,
          itemName: 'AWS'
        },
        {
          id: 4,
          itemName: '1時間以内'
        },
        {
          id: 5,
          textAnswer: '10'
        }
      ],
      metadataId: 1,
      answeredDate: '2023-07-10',
      userId: 'userZ',
      updateUser: 'userY',
      updatedDate: '2023-08-10'
    });
    expect(response.answers[1]).toEqual({
      answer: [
        {
          id: 1,
          itemName: 'システムB'
        },
        {
          id: 2,
          itemName: 'アジャイル'
        },
        {
          id: 3,
          itemId: 6,
          itemName: 'AWS'
        },
        {
          id: 3,
          itemId: 8,
          itemName: 'Azure'
        },
        {
          id: 3,
          itemId: 6,
          itemName: 'AWS',
          textAnswer: undefined
        },
        {
          id: 3,
          itemId: 8,
          itemName: 'Azure',
          textAnswer: undefined
        },
        {
          id: 4,
          itemName: '1日以内'
        },
        {
          id: 5,
          textAnswer: '5'
        }
      ],
      metadataId: 2,
      answeredDate: '2023-07-11',
      userId: 'userY',
      updateUser: 'userX',
      updatedDate: '2023-08-11'
    });
    expect(typeof response.totalCount).toBe('number');
  });
});

describe('準正常系', () => {
  test('questionnairIdを指定しないと必要なパラメータが指定されていないと判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      limit: '2',
      offset: '2'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('必要なパラメーターが指定されていません。');
  });
  test('limitを指定しないと必要なパラメータが指定されていないと判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      offset: '2'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('必要なパラメーターが指定されていません。');
  });
  test('offsetを指定しないと必要なパラメータが指定されていないと判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: '2'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('必要なパラメーターが指定されていません。');
  });
  test('questionnairIdに数字以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: 'aaa',
      limit: '2',
      offset: '2'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });
  test('limitに数字以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: 'aaa',
      offset: '2'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });
  test('offsetに数字以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: '2',
      offset: 'aaa'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });
  test('limitに0以下の数字を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: '0',
      offset: '0'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('limitに100以上の数字を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: '101',
      offset: '0'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('offsetに0未満の数字を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: '2',
      offset: '-1'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });

  test('limitに数字以外を入力すると不正なパラメータであると判定されること', async () => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
      questionnairId: '1',
      limit: 'aaa',
      offset: '0'
    };

    const response = await createGetResponseBody(queryStringParameters, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });
});
