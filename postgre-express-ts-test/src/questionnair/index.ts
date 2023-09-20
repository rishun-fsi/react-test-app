import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { createGetResponseBody } from './get';
import { createGetOneResponseBody } from './get-one';

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'GET') {
    throw new Error('The request method is prohibited');
  }

  const password = process.env['PASSWORD'];
  if (!password) {
    throw new Error('Password is not found.');
  }

  if (
    event.httpMethod === 'GET' &&
    !event.queryStringParameters &&
    !event.pathParameters
  ) {
    return createResponse(400, { message: 'データを指定してください。' });
  }

  try {
    const db = connectDB(password);

    if (
      event.pathParameters !== null &&
      event.pathParameters.questionnairId !== undefined
    ) {
      const getOneResponse = await createGetOneResponseBody(
        Number(event.pathParameters.questionnairId),
        db
      );
      return createResponse(getOneResponse.statusCode, getOneResponse.body);
    }

    const getResponse = await createGetResponseBody(
      event.queryStringParameters!,
      db
    );
    return createResponse(getResponse.statusCode, getResponse.body);
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
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};
