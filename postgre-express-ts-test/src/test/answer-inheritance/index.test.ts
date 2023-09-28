import { Context } from 'aws-lambda';
import { lambdaHandler } from '../../answer-inheritance';
import * as getEvent from './json/get.json';
import * as userGetEvent from './json/user-get.json';

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
  test('通常のget', async () => {
    const response = await lambdaHandler(getEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).answers).toEqual([
      { questionId: 2, itemId: 5 },
      { questionId: 3, itemId: 8 }
    ]);
  });

  test('userIdを指定するget', async () => {
    const response = await lambdaHandler(userGetEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).answers).toEqual([
      { questionId: 2, itemId: 4 },
      { questionId: 3, itemId: 9 }
    ]);
  });
});
