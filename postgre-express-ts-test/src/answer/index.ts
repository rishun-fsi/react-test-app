import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { createPostResponseBody } from './post';
import { createGetResponseBody } from './get';
import { createPutResponseBody } from './put';
import { createChunkPostResponseBody } from './chunk-post';
import { createChunkPutResponseBody } from './chunk-put';
import { PostEventBody } from './interface/EventBody';

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const allowedHttpMethods: string[] = ['GET', 'POST', 'PUT'];
  if (!allowedHttpMethods.includes(event.httpMethod)) {
    throw new Error('The request method is prohibited');
  }

  const password = process.env['PASSWORD'];
  if (!password) {
    throw new Error('password is not found.');
  }

  if (
    (event.httpMethod === 'GET' && !event.queryStringParameters) ||
    ((event.httpMethod === 'POST' || event.httpMethod === 'PUT') && !event.body)
  ) {
    return createResponse(400, { message: 'データを指定してください。' });
  }

  try {
    const db = connectDB(password);
    if (event.httpMethod === 'POST' && event.path === '/answer/chunk') {
      const metadataIds: number[] = JSON.parse(event.body!).metadataIds;
      const chunkPostResponse = await createChunkPostResponseBody(
        metadataIds,
        db
      );
      return createResponse(
        chunkPostResponse.statusCode,
        chunkPostResponse.body
      );
    } else if (event.httpMethod === 'POST') {
      const eventBody: PostEventBody = JSON.parse(event.body!);
      const postResponse = await createPostResponseBody(eventBody, db);
      return createResponse(postResponse.statusCode, postResponse.body);
    } else if (event.httpMethod === 'GET') {
      const getResponse = await createGetResponseBody(
        event.queryStringParameters!,
        db
      );
      return createResponse(getResponse.statusCode, getResponse.body);
    } else if (event.httpMethod === 'PUT' && event.path === '/answer/chunk') {
      const chunkPutResponse = await createChunkPutResponseBody(
        JSON.parse(event.body!),
        db
      );
      return createResponse(chunkPutResponse.statusCode, chunkPutResponse.body);
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
