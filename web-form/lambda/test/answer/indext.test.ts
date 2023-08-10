import { Context, APIGatewayEvent } from 'aws-lambda';
import { lambdaHandler } from '../../answer';
import { PostEventBody, PostedAnswer } from '../../answer/interface/EventBody';
import * as postEvent from './json/post.json';

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

const answers: PostedAnswer[] = [
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
