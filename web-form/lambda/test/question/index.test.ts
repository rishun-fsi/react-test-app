import { Context, APIGatewayEvent } from 'aws-lambda';
import { lambdaHandler } from '../../question';
import * as getEvent from './json/get.json';

const context: Context = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: (): number => {
    return 0;
  },
  done: (error?: Error, result?: any): void => {
    const a = 1;
  },
  fail: (error: Error | string): void => {
    const b = -1;
  },
  succeed: (messageOrObject: any): void => {
    const c = 1;
  }
};

test('get', async () => {
  const response = await lambdaHandler(getEvent, context);
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).message).toBe('success');
  expect(JSON.parse(response.body).questions[0]).toEqual({
    id: 1,
    question: '対象のアプリ・システム名を選択してください。',
    type: 'select',
    required: true,
    headline: 'システム名',
    items: [
      { id: 1, name: 'システムA', isDiscription: false, isDeleted: false },
      { id: 2, name: 'システムB', isDiscription: false, isDeleted: false },
      { id: 3, name: 'システムC', isDiscription: false, isDeleted: false }
    ],
    isDeleted: false,
    priority: 1
  });
  expect(JSON.parse(response.body).questions[1]).toEqual({
    groupId: 1,
    group: '開発環境',
    questions: [
      {
        id: 2,
        question: '対象システムの開発手法を選択してください。',
        type: 'radio',
        required: true,
        headline: '開発手法',
        items: [
          { id: 4, name: 'アジャイル', isDiscription: false, isDeleted: false },
          {
            id: 5,
            name: 'ウォーターフォール',
            isDiscription: false,
            isDeleted: false
          }
        ],
        isDeleted: false,
        priority: 2
      },
      {
        id: 3,
        question: '対象システムのサーバ基盤を選択してください。',
        type: 'check',
        required: false,
        headline: 'サーバーの土台',
        items: [
          { id: 6, name: 'AWS', isDiscription: false, isDeleted: false },
          { id: 7, name: 'GCP', isDiscription: false, isDeleted: false },
          { id: 8, name: 'Azure', isDiscription: false, isDeleted: false },
          {
            id: 9,
            name: 'ドコモ内オンプレ',
            isDiscription: false,
            isDeleted: false
          },
          { id: 10, name: 'その他', isDiscription: true, isDeleted: false }
        ],
        isDeleted: false,
        priority: 3
      }
    ]
  });
  expect(JSON.parse(response.body).questions.length).toBe(3);
});

test('isAllにtrueを指定する場合', async () => {
  const request: APIGatewayEvent = {
    ...getEvent,
    queryStringParameters: { questionnairId: '1', isAll: 'true' }
  };
  const response = await lambdaHandler(request, context);
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).questions.length).toBe(4);
});

test('1未満の整数をアンケートIDに指定する場合', async () => {
  const request: APIGatewayEvent = {
    ...getEvent,
    queryStringParameters: { questionnairId: '0' }
  };

  const response = await lambdaHandler(request, context);
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body).message).toBe(
    '不正なパラメータが指定されました。'
  );
});

test('整数以外をアンケートIDに指定する場合', async () => {
  const request: APIGatewayEvent = {
    ...getEvent,
    queryStringParameters: { questionnairId: 'a' }
  };

  const response = await lambdaHandler(request, context);
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body).message).toBe(
    '不正なパラメータが指定されました。'
  );
});

test('t/f以外をisAllに指定する場合', async () => {
  const request: APIGatewayEvent = {
    ...getEvent,
    queryStringParameters: { questionnairId: '1', isAll: 'test' }
  };

  const response = await lambdaHandler(request, context);
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body).message).toBe(
    '不正なパラメータが指定されました。'
  );
});

test('アンケートIDに指定しない場合', async () => {
  const request: APIGatewayEvent = {
    ...getEvent,
    queryStringParameters: {}
  };

  const response = await lambdaHandler(request, context);
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body).message).toBe(
    'アンケートのIDが指定されていません。'
  );
});
