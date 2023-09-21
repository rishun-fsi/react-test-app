import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { createGetResponseBody } from './get';
import { createPostResponseBody } from './post';
import { createPutResponseBody } from './put';

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const allowedHttpMethods: string[] = ['GET', 'PUT', 'POST'];
  if (!allowedHttpMethods.includes(event.httpMethod)) {
    throw new Error('The request method is prohibited');
  }

  const password = process.env['PASSWORD'];
  if (!password) {
    throw new Error('Password is not found.');
  }

  if (
    (event.httpMethod === 'GET' && !event.queryStringParameters) ||
    ((event.httpMethod === 'POST' || event.httpMethod === 'PUT') && !event.body)
  ) {
    return createResponse(400, { message: 'データを指定してください。' });
  }

  try {
    const db = connectDB(password);
    if (event.httpMethod === 'GET') {
      const getResponse = await createGetResponseBody(
        event.queryStringParameters!,
        db
      );
      return createResponse(getResponse.statusCode, getResponse.body);
    } else if (event.httpMethod === 'POST') {
      const postResponse = await createPostResponseBody(
        JSON.parse(event.body!),
        db
      );
      return createResponse(postResponse.statusCode, postResponse.body);
    } else {
      const putResponse = await createPutResponseBody(
        JSON.parse(event.body!),
        db
      );
      return createResponse(putResponse.statusCode, putResponse.body);
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
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};
