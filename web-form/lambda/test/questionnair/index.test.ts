import { Context } from 'aws-lambda';
import { lambdaHandler } from '../../questionnair';
import * as getEvent from './json/get.json';
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

describe('GETのテスト', () => {
  test('正常に応答が得られること', async () => {
    const response = await lambdaHandler(getEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).questionnairs.length).toBe(2);
    expect(JSON.parse(response.body).questionnairs[0]).toEqual({
      id: 1,
      name: 'PJ健康診断アンケート',
      createdDate: '2023-07-21',
      updatedDate: '2023-07-21',
      isDeleted: false,
      userId: 'test'
    });
    expect(typeof JSON.parse(response.body).totalCount).toBe('number');
  });
});

describe('questionnairIdを指定してGETするテスト', () => {
  test('正常に応答が得られること', async () => {
    const response = await lambdaHandler(getOneEvent, context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe('success');
    expect(JSON.parse(response.body).questionnair).toEqual({
      id: 1,
      name: 'PJ健康診断アンケート',
      createdDate: '2023-07-21',
      updatedDate: '2023-07-21',
      isDeleted: false,
      userId: 'test'
    });
  });
});
