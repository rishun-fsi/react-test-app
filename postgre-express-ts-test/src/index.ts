import { db } from './db';
import { createGetResponseBody as createQuestionGetResponseBody} from './question/get';
import { createPostResponseBody as  createQuestionPostResponseBody} from './question/post';
import { createPutResponseBody as createQuestionPutResponseBody} from './question/put';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { createPostResponseBody } from './answer/post';
import { createGetResponseBody } from './answer/get';
import { createPutResponseBody } from './answer/put';
import { createChunkPostResponseBody } from './answer/chunk-post';
import { createChunkPutResponseBody } from './answer/chunk-put';
import { PostEventBody } from './answer/interface/EventBody';

import { createGetResponseBody as  createGetResponseBody2} from './answer-metadata/get';

import { createGetResponseBody as  createGetResponseBody3} from './questionnair/get';
import { createGetOneResponseBody } from './questionnair/get-one';

import * as express from "express";
import { NextFunction, Request, Response } from "express"
import * as cors from 'cors';
const app = express();
app.use(cors<Request>());
app.use(express.json());


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

app.use("/answer/:metadataId", async (req: Request, res: Response, next: NextFunction) => {

  if (
    req.method === 'GET' &&
    (! req.params ||
    ! req.params!.metadataId)
  ) {
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


app.use("/answer", async (req: Request, res: Response, next: NextFunction) => {

  if (
    (req.method === 'GET' && !req.query) ||
    ((req.method === 'POST' || req.method === 'PUT') && !req.body)
  ) {
    //return createResponse(400, { message: 'データを指定してください。' });
    return res.status(400).json({ message: 'データを指定してください。' });
  }

  try {
    if (req.method === 'POST' && req.path === '/answer/chunk') {
      const metadataIds: number[] = req.body!.metadataIds;
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
    } else if (req.method === 'PUT' && req.path === '/answer/chunk') {
      const chunkPutResponse = await createChunkPutResponseBody(
        req.body!,
        db
      );
      //return createResponse(chunkPutResponse.statusCode, chunkPutResponse.body);
      return res.status(chunkPutResponse.statusCode).json(chunkPutResponse.body);
    } else {
      const putResponse = await createPutResponseBody(
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


const PORT = 5000
app.listen(PORT, (): void => {
  console.log("server is running on PORT " + PORT);
});