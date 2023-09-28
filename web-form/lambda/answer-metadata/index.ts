import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { createGetResponseBody } from './get';

const existPathParameter = (event: APIGatewayEvent, key: string): boolean =>
  Boolean(event.pathParameters && event.pathParameters[key]);

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

  if (!existPathParameter(event, 'metadataId'))
    return createResponse(400, { message: 'データを指定してください。' });

  try {
    const db = connectDB(password);

    const metadataId = Number(event.pathParameters!.metadataId);
    const getResponse = await createGetResponseBody(metadataId, db);
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
      'Access-Control-Allow-Methods': 'GET,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};
