import { connectDB } from './question/db';
import { createGetResponseBody as createQuestionGetResponseBody} from './question/get';
import { createPostResponseBody as  createQuestionPostResponseBody} from './question/post';
import { createPutResponseBody as createQuestionPutResponseBody} from './question/put';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { createPostResponseBody } from './answer/post';
import { createGetResponseBody } from './answer/get';
import { createPutResponseBody } from './answer/put';
import { createDeleteResponseBody } from './answer/delete';
import { createChunkPostResponseBody } from './answer/chunk-post';
import { createChunkPutResponseBody } from './answer/chunk-put';
import { PostEventBody } from './answer/interface/EventBody';


import { createPostResponseBody as createNotificationsPostResponseBody} from './notifications/post';
import { createGetOneResponseBody as createGetOneResponseBody2 } from './notifications/get-one';
import { createGetResponseBody as  createGetResponseBody5} from './notifications/get';

import { createGetResponseBody as  createGetResponseBody4} from './notifications-type/get';

import { createGetResponseBody as  createGetResponseBody2} from './answer-metadata/get';


import { createGetResponseBody as  createGetResponseBody3} from './questionnair/get';
import { createGetOneResponseBody } from './questionnair/get-one';

import * as express from "express";
import { NextFunction, Request, Response } from "express"
import * as cors from 'cors';

import * as dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors<Request>());
app.use(express.json());

const password = process.env['PASSWORD'];
if (!password) {
  throw new Error('password is not found.');
}

const db = connectDB(password);


const existPathParameter = (req: Request, key: string): boolean =>
  Boolean(req.params && req.params[key]);


app.use("/question", async (req: Request, res: Response, next: NextFunction) => {
  if (
    (req.method === 'GET' && !req.query) ||
    ((req.method === 'POST' || req.method === 'PUT') && !req.body)
  ) {
    //return createResponse(400, { message: 'データを指定してください。' });
    return res.status(400).json({ message: 'データを指定してください。' });
  }
  try {
    if (req.method === 'GET') {
      const getResponse = await createQuestionGetResponseBody(
        req.query! as APIGatewayProxyEventQueryStringParameters,
        db
      );
      //return createResponse(getResponse.statusCode, getResponse.body);
      return res.status(getResponse.statusCode).json(getResponse.body);
    } else if (req.method === 'POST') {
      const postResponse = await createQuestionPostResponseBody(
        req.body!,
        db
      );
      //return createResponse(postResponse.statusCode, postResponse.body);
      return res.status(postResponse.statusCode).json(postResponse.body);
    } else {
      const putResponse = await createQuestionPutResponseBody(
        req.body!,
        db
      );
      //return createResponse(putResponse.statusCode, putResponse.body);
      return res.status(putResponse.statusCode).json(putResponse.body);
    }
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }

});

app.get("/answer/:metadataId", async (req: Request, res: Response, next: NextFunction) => {
  if (!existPathParameter(req, 'metadataId')){
    //return createResponse(400, { message: 'データを指定してください。' });
    return res.status(400).json({ message: 'データを指定してください。' });
  }

  try {
    const metadataId = Number(req.params!.metadataId);
    const getResponse = await createGetResponseBody2(metadataId, db);
    //return createResponse(getResponse.statusCode, getResponse.body);
    return res.status(getResponse.statusCode).json(getResponse.body);
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }

});

const answerHandle = async (req: Request, res: Response, next: NextFunction) => {
  if (
    (req.method === 'GET' && !req.query) ||
    ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && !req.body)
  ) {
    //return createResponse(400, { message: 'データを指定してください。' });
    return res.status(400).json({ message: 'データを指定してください。' });
  }
  try {
    if (req.method === 'POST' && req.path === '/chunk') {
      const metadataIds: number[] = req.body!.metadataIds;
      console.log(metadataIds);
      const chunkPostResponse = await createChunkPostResponseBody(
        metadataIds,
        db
      );
      // return createResponse(
      //   chunkPostResponse.statusCode,
      //   chunkPostResponse.body
      // );
      return res.status(chunkPostResponse.statusCode).json(chunkPostResponse.body);
    } else if (req.method === 'POST') {
      const eventBody: PostEventBody = req.body!;
      const postResponse = await createPostResponseBody(eventBody, db);
      //return createResponse(postResponse.statusCode, postResponse.body);
      return res.status(postResponse.statusCode).json(postResponse.body);
    } else if (req.method === 'GET') {
      const getResponse = await createGetResponseBody(
        req.query! as APIGatewayProxyEventQueryStringParameters,
        db
      );
      //return createResponse(getResponse.statusCode, getResponse.body);
      return res.status(getResponse.statusCode).json(getResponse.body);
    } else if (req.method === 'PUT' && req.path === '/chunk') {
      const chunkPutResponse = await createChunkPutResponseBody(
        req.body!,
        db
      );
      //return createResponse(chunkPutResponse.statusCode, chunkPutResponse.body);
      return res.status(chunkPutResponse.statusCode).json(chunkPutResponse.body);
    } else if(req.method === 'PUT'){
      const putResponse = await createPutResponseBody(
        req.body!,
        db
      );
      //return createResponse(putResponse.statusCode, putResponse.body);
      return res.status(putResponse.statusCode).json(putResponse.body);
    } else {
      const deleteResponse = await createDeleteResponseBody(
        req.body!,
        db
      );
      //return createResponse(deleteResponse.statusCode, deleteResponse.body);
      return res.status(deleteResponse.statusCode).json(deleteResponse.body);
    }
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }
}

app.use("/answer", answerHandle);
app.post("/answer/chunk", answerHandle);

const questionnairHandle = async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === 'GET' &&
    !req.query &&
    !req.params
  ) {
    //return createResponse(400, { message: 'データを指定してください。' });
    return res.status(400).json({ message: 'データを指定してください。' });
  }

  try {
    if (
      req.params !== null &&
      req.params.questionnairId !== undefined
    ) {
      const getOneResponse = await createGetOneResponseBody(
        Number(req.params.questionnairId),
        db
      );
      //return createResponse(getOneResponse.statusCode, getOneResponse.body);
      return res.status(getOneResponse.statusCode).json(getOneResponse.body);
    }

    const getResponse = await createGetResponseBody3(
      req.query! as APIGatewayProxyEventQueryStringParameters,
      db
    );
    //return createResponse(getResponse.statusCode, getResponse.body);
    return res.status(getResponse.statusCode).json(getResponse.body);
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }

}

app.use("/questionnair/:questionnairId", questionnairHandle);

app.use("/questionnair", questionnairHandle);

app.get("/notifications/type", async (req: Request, res: Response, next: NextFunction) => {

  try {
    const db = connectDB(password);

    const getResponse = await createGetResponseBody4(db);
    //return createResponse(getResponse.statusCode, getResponse.body);
    return res.status(getResponse.statusCode).json(getResponse.body);
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }

});

const notificationsHandle = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && !req.body) {
    //return createResponse(400, { message: 'データを指定してください。' });
    return res.status(400).json({ message: 'データを指定してください。' });
  }

  try {
    const db = connectDB(password);
    if (
      req.method === 'GET' &&
      req.params !== null &&
      req.params.notificationId !== undefined
    ) {
      const getResponse = await createGetOneResponseBody2(
        Number(req.params.notificationId),
        db
      );
      //return createResponse(getResponse.statusCode, getResponse.body);
      return res.status(getResponse.statusCode).json(getResponse.body);
    } else if( req.method === 'GET') {

      const getResponse = await createGetResponseBody5(
        req.query! as APIGatewayProxyEventQueryStringParameters,
        db
      );
      //return createResponse(getResponse.statusCode, getResponse.body);
      return res.status(getResponse.statusCode).json(getResponse.body);
    } else {
      const postResponse = await createNotificationsPostResponseBody(req.body!, db);
      //return createResponse(postResponse.statusCode, postResponse.body);
      return res.status(postResponse.statusCode).json(postResponse.body);
    }
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }
}


app.use("/notifications/:notificationId", notificationsHandle);

app.use("/notifications", notificationsHandle);


const PORT = 5000
app.listen(PORT, (): void => {
  console.log("server is running on PORT " + PORT);
});