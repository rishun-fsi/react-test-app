import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { createGetResponseBody } from './get';
import { Answer } from './interface/Answer';

const existQueryParameter = (event: APIGatewayEvent, key: string): boolean =>
  Boolean(event.queryStringParameters && event.queryStringParameters[key]);

const existPathParameter = (event: APIGatewayEvent, key: string): boolean =>
  Boolean(event.pathParameters && event.pathParameters[key]);

const createInputAnswer = (
  event: APIGatewayEvent,
  existItemId: boolean,
  existTextAnswer: boolean
): Answer => {
  const questionId: number = Number(event.queryStringParameters!.questionId);
  const itemId: number | undefined = existItemId
    ? Number(event.queryStringParameters!.itemId)
    : undefined;
  const textAnswer: string | undefined = existTextAnswer
    ? event.queryStringParameters!.textAnswer
    : undefined;

  return { questionId, itemId, textAnswer };
};

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const allowedHttpMethods: string[] = ['GET'];
  if (!allowedHttpMethods.includes(event.httpMethod)) {
    throw new Error('The request method is prohibited');
  }

  const password = process.env['PASSWORD'];
  if (!password) {
    throw new Error('password is not found.');
  }

  const existQuestionnairId: boolean = existQueryParameter(
    event,
    'questionnairId'
  );
  const existItemId: boolean = existQueryParameter(event, 'itemId');
  const existTextAnswer: boolean = existQueryParameter(event, 'textAnswer');
  const existQuestionId: boolean =
    existQueryParameter(event, 'questionId') &&
    (existItemId || existTextAnswer);
  const existUserId: boolean = existPathParameter(event, 'userId');

  const isInheritanceRequest =
    event.path === '/answer/inheritance' &&
    existQuestionnairId &&
    existQuestionId;
  const isInheritanceUserRequest =
    event.path.startsWith('/answer/inheritance') &&
    existQuestionnairId &&
    existUserId;

  try {
    const db = connectDB(password);

    if (isInheritanceRequest || isInheritanceUserRequest) {
      const questionnairId: number = Number(
        event.queryStringParameters!.questionnairId
      );
      const userId: string | undefined = existUserId
        ? event.pathParameters!.userId
        : undefined;
      const inputAnswer: Answer | undefined = existQuestionId
        ? createInputAnswer(event, existItemId, existTextAnswer)
        : undefined;

      const inheritanceResponse = await createGetResponseBody(
        db,
        questionnairId,
        userId,
        inputAnswer
      );
      return createResponse(
        inheritanceResponse.statusCode,
        inheritanceResponse.body
      );
    } else {
      return createResponse(400, { message: 'データを指定してください。' });
    }
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    return createResponse(500, body);
  }
};

const createResponse = (
  statusCode: number,
  body: object
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};
