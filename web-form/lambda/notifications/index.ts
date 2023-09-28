import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { createPostResponseBody } from './post';
import { PostEventBody } from './interface/EventBody';

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const allowedHttpMethods: string[] = ['POST'];
  if (!allowedHttpMethods.includes(event.httpMethod)) {
    throw new Error('The request method is prohibited');
  }

  const password = process.env['PASSWORD'];
  if (!password) {
    throw new Error('password is not found.');
  }

  if (event.httpMethod === 'POST' && !event.body) {
    return createResponse(400, { message: 'データを指定してください。' });
  }

  try {
    const db = connectDB(password);

    const eventBody: PostEventBody = JSON.parse(event.body!);
    const postResponse = await createPostResponseBody(eventBody, db);
    return createResponse(postResponse.statusCode, postResponse.body);
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
