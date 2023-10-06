import { Context, APIGatewayEvent } from 'aws-lambda';
import { lambdaHandler } from '../../notifications';
import { PostEventBody } from '../../notifications/interface/EventBody';
import * as postEvent from './json/post.json';
import * as getOneEvent from './json/get-one.json';

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

describe('POSTメソッドのテスト', () => {
  const postBody: PostEventBody = {
    title: 'test',
    content: 'this is new notification content',
    typeId: 1,
    userId: 'hideaki.azuma.ra@nttcom.co.jp'
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

describe('notificationIdを指定してGETするテスト', () => {
  test('正常に応答が得られること', async () => {
    const response = await lambdaHandler(getOneEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).notificationDetail).toEqual({
      content: 'test1_content',
      date: '2023-10-06'
    });
  });
});
