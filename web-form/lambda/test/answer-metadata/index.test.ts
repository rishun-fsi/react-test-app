import { Context } from 'aws-lambda';
import { lambdaHandler } from '../../answer-metadata';
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

describe('GETメソッドのテスト', () => {
  test('get', async () => {
    const response = await lambdaHandler(getEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).answers[0]).toEqual({
      answerId: 1,
      questionId: 1,
      itemId: 1
    });
    expect(JSON.parse(response.body).answers[1]).toEqual({
      answerId: 2,
      questionId: 2,
      itemId: 4
    });
    expect(JSON.parse(response.body).answers[2]).toEqual({
      answerId: 3,
      questionId: 3,
      itemId: 6
    });
    expect(JSON.parse(response.body).answers[3]).toEqual({
      answerId: 4,
      questionId: 4,
      itemId: 11
    });
    expect(JSON.parse(response.body).answers[4]).toEqual({
      answerId: 5,
      questionId: 5,
      textAnswer: '10'
    });
  });
});
