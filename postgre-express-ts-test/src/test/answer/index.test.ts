import { Context, APIGatewayEvent } from 'aws-lambda';
import { lambdaHandler } from '../../answer';
import {
  ChunkPutEventBody,
  DeleteEventBody,
  PostEventBody,
  PutEventBody
} from '../../answer/interface/EventBody';
import { NewAnswer } from '../../answer/interface/Answer';
import * as postEvent from './json/post.json';
import * as getEvent from './json/get.json';
import * as putEvent from './json/put.json';
import * as deleteEvent from './json/delete.json';
import * as chunkPutEvent from './json/chunk-put.json';
import * as chunkPostEvent from './json/chunk-post.json';

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
  test('get(回答一覧の取得)', async () => {
    const response = await lambdaHandler(getEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).headers[0]).toEqual({
      id: 1,
      name: 'システム名'
    });
    expect(JSON.parse(response.body).headers[1]).toEqual({
      id: 2,
      name: '開発手法'
    });
    expect(JSON.parse(response.body).headers[2]).toEqual({
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
    expect(JSON.parse(response.body).headers[3]).toEqual({
      id: 4,
      name: '変更のリードタイム'
    });

    expect(JSON.parse(response.body).answers[0]).toEqual({
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
      answeredDate: '2023-10-01',
      userId: 'userZ',
      updateUser: 'userY',
      updatedDate: '2023-10-10'
    });
    expect(JSON.parse(response.body).answers[1]).toEqual({
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
          id: 4,
          itemName: '1日以内'
        },
        {
          id: 5,
          textAnswer: '5'
        }
      ],
      metadataId: 2,
      answeredDate: '2023-10-02',
      userId: 'userY',
      updateUser: 'userX',
      updatedDate: '2023-10-11'
    });
    expect(typeof JSON.parse(response.body).totalCount).toBe('number');
  });
});

describe('POSTメソッドのテスト', () => {
  const answers: NewAnswer[] = [
    {
      questionId: 1,
      itemId: 1
    }
  ];

  const postBody: PostEventBody = {
    answers,
    userId: 'test',
    questionnairId: 1
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
  const putBody: PutEventBody = {
    answers: {
      existing: [
        {
          answerId: 27,
          itemId: 5
        }
      ],
      new: [{ questionId: 3, itemId: 9 }]
    },
    userId: 'test',
    questionnairId: 1,
    metadataId: 6
  };

  const request: APIGatewayEvent = {
    ...putEvent,
    body: JSON.stringify(putBody)
  };

  test('put', async () => {
    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
  });
});

describe('DELETEメソッド', () => {
  const deleteBody: DeleteEventBody = {
    metadataIds: [14],
    userId: 'test',
    questionnairId: 1
  };

  const request: APIGatewayEvent = {
    ...deleteEvent,
    body: JSON.stringify(deleteBody)
  };

  test('delete', async () => {
    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
  });
});

describe('answer/chunk/のPUTメソッド', () => {
  const chunkPutBody: ChunkPutEventBody = {
    answers: [{ metadataId: 7, new: [{ questionId: 3, itemId: 8 }] }],
    userId: 'test',
    questionnairId: 1
  };

  const request: APIGatewayEvent = {
    ...chunkPutEvent,
    body: JSON.stringify(chunkPutBody)
  };

  test('answer/chunk/のput', async () => {
    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
  });
});

describe('answer/chunk/のPOSTメソッド', () => {
  const chunkPostBody = {
    metadataIds: [4]
  };

  const request: APIGatewayEvent = {
    ...chunkPostEvent,
    body: JSON.stringify(chunkPostBody)
  };

  test('answer/chunk/のpost', async () => {
    const response = await lambdaHandler(request, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
  });
});
