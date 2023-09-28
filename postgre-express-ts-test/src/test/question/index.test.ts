import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { Context, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from '../../question/db';
import { lambdaHandler } from '../../question';
import { insertQuestionnairMetadata } from '../../question/post';
import {
  PostEventBody,
  PostedQuestion,
  PostedQuestionItem,
  PostedInheritance,
  PutEventBody
} from '../../question/interface/EventBody';
import {
  extractItems,
  insertQuestionItems,
  insertQuestions
} from '../../question/common';
import {
  DBNewQuestion,
  DBNewQuestionItem,
  DBQuestionnairMetadata
} from '../../question/interface/Question';
import * as getEvent from './json/get.json';
import * as postEvent from './json/post.json';
import * as putEvent from './json/put.json';

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

describe('GETメソッドのテスト', () => {
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
        { id: 1, name: 'システムA', isDescription: false, isDeleted: false },
        { id: 2, name: 'システムB', isDescription: false, isDeleted: false },
        { id: 3, name: 'システムC', isDescription: false, isDeleted: false }
      ],
      canInherit: false,
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
            {
              id: 4,
              name: 'アジャイル',
              isDescription: false,
              isDeleted: false
            },
            {
              id: 5,
              name: 'ウォーターフォール',
              isDescription: false,
              isDeleted: false
            }
          ],
          canInherit: true,
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
            { id: 6, name: 'AWS', isDescription: false, isDeleted: false },
            { id: 7, name: 'GCP', isDescription: false, isDeleted: false },
            { id: 8, name: 'Azure', isDescription: false, isDeleted: false },
            {
              id: 9,
              name: 'ドコモ内オンプレ',
              isDescription: false,
              isDeleted: false
            },
            { id: 10, name: 'その他', isDescription: true, isDeleted: false }
          ],
          canInherit: true,
          isDeleted: false,
          priority: 3
        }
      ]
    });
    expect(JSON.parse(response.body).questions.length).toBe(4);

    expect(JSON.parse(response.body).inheritance).toEqual({
      isSameUser: false,
      questionId: 1
    });
  });

  test('isAllにtrueを指定する場合', async () => {
    const request: APIGatewayEvent = {
      ...getEvent,
      queryStringParameters: { questionnairId: '1', isAll: 'true' }
    };
    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).questions.length).toBe(5);
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
});

describe('POSTメソッドのテスト', () => {
  const questionItems: PostedQuestionItem[] = [
    {
      name: '選択肢E',
      isDescription: true
    },
    {
      name: '選択肢F',
      isDescription: true
    },
    {
      name: '選択肢G',
      isDescription: true
    }
  ];

  const postedQuestions: PostedQuestion[] = [
    {
      question: 'test',
      type: 'radio',
      required: true,
      headline: 'test',
      canInherit: true,
      items: questionItems
    }
  ];

  const postedInheritance: PostedInheritance = {
    isSameUser: false,
    questionIndex: 0
  };

  const postBody: PostEventBody = {
    userId: 'userB',
    name: 'アンケートB',
    inheritance: postedInheritance,
    questions: postedQuestions
  };
  const request: APIGatewayEvent = {
    ...postEvent,
    body: JSON.stringify(postBody)
  };

  test('post', async () => {
    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
  });
});

describe('PUTメソッドのテスト', () => {
  let questionnairId: number = 0;
  let questionIds: number[] = [];
  let itemIds: number[] = [];
  beforeAll(async () => {
    const password: string = process.env['PASSWORD']!;
    const db: pgPromise.IDatabase<
      Record<string, never>,
      pg.IClient
    > = connectDB(password);
    const metadata: DBQuestionnairMetadata = {
      user_id: 'test',
      created_date: new Date(),
      updated_date: new Date(),
      name: 'テスト用アンケート'
    };

    await db.tx(async (t) => {
      questionnairId = await insertQuestionnairMetadata(metadata, t);
      const questions: DBNewQuestion[] = [
        {
          question: 'aaa',
          question_type_id: 1,
          required: true,
          headline: 'aaa',
          questionnair_id: questionnairId,
          can_inherit: true,
          priority: 1,
          items: [
            { item_name: 'item1', is_description: false, priority: 1 },
            { item_name: 'item2', is_description: false, priority: 2 }
          ]
        },
        {
          question: 'bbb',
          question_type_id: 4,
          required: true,
          headline: 'aaa',
          questionnair_id: questionnairId,
          can_inherit: true,
          priority: 1
        }
      ];

      questionIds = await insertQuestions(questions, t);
      const items: DBNewQuestionItem[] = extractItems(questions, questionIds);
      itemIds = await insertQuestionItems(items, t);
    });
  });

  test('put', async () => {
    const putBody: PutEventBody = {
      existing: [
        {
          id: questionIds[0],
          type: 'radio',
          question: 'test',
          required: false,
          headline: 'システム名改',
          canInherit: false,
          isDeleted: false,
          priority: 4,
          items: {
            existing: [
              {
                id: itemIds[0],
                name: 'システムA',
                isDescription: true,
                priority: 1,
                isDeleted: true
              },
              {
                id: itemIds[1],
                name: 'システムB',
                isDescription: true,
                priority: 2,
                isDeleted: true
              }
            ],
            new: [
              {
                name: 'システムD',
                isDescription: false,
                priority: 3
              },
              {
                name: 'システムE',
                isDescription: false,
                priority: 1
              }
            ]
          }
        }
      ],
      new: [
        {
          type: 'select',
          question: 'AはBですか',
          required: true,
          headline: '見出し',
          canInherit: true,
          priority: 6,
          items: [
            {
              name: '選択肢X',
              isDescription: false,
              priority: 2
            },
            {
              name: '選択肢Y',
              isDescription: false,
              priority: 1
            },
            {
              name: '選択肢Z',
              isDescription: false,
              priority: 3
            }
          ]
        }
      ],
      inheritance: {
        isSameUser: false,
        questionId: 1
      },
      questionnairName: 'PJ健康診断アンケート改',
      questionnairId
    };
    const request: APIGatewayEvent = {
      ...putEvent,
      body: JSON.stringify(putBody)
    };

    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
  });
});
