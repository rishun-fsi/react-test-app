import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { FrontendS3Resource } from './resources/s3Resource';
import { RdsResource } from './resources/rdsResources';
import { DcmDxPjHealthcheckWebFormStackProps } from './interface/dcmDxPjHealthcheckWebFormStackProps';
import { LambdaResource } from './resources/lambdaResource';
import { ApiGatewayResource } from './resources/apiGatewayResource';
import { CloudFrontResource } from './resources/cloudFrontResource';

export class DcmDxPjHealthcheckWebFormStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: DcmDxPjHealthcheckWebFormStackProps
  ) {
    super(scope, id, props);

    const frontendS3Resource = new FrontendS3Resource();
    const frontendS3: s3.Bucket = frontendS3Resource.createResources(this);

    const cloudFrontResource = new CloudFrontResource();
    const originAccessIdentity: cloudfront.OriginAccessIdentity =
      cloudFrontResource.createOriginAccessIdentity(this);
    const cloudFrontDistribution: cloudfront.Distribution =
      cloudFrontResource.createResources(
        this,
        originAccessIdentity,
        frontendS3
      );

    const rdsResource = new RdsResource(this);
    const dbInstance: rds.DatabaseInstance = rdsResource.createResource(this);
    const dbProxy: rds.DatabaseProxy = rdsResource.createProxy(
      this,
      dbInstance
    );
    const readReplica: rds.DatabaseInstanceReadReplica =
      rdsResource.createReadReplica(this, dbInstance);

    const lambdaResource = new LambdaResource(
      this,
      props.password,
      dbProxy.endpoint
    );
    const answerLambda: lambda.Function = lambdaResource.createResources(
      this,
      'answer'
    );
    const questionLambda: lambda.Function = lambdaResource.createResources(
      this,
      'question'
    );

    const apiGatewayResource = new ApiGatewayResource();
    const apiGateway: apigateway.RestApi = apiGatewayResource.createResources(
      this,
      'dcm-dx-pj-healthcheck-web-form'
    );
    apiGateway.root
      .addResource('answer')
      .addMethod('POST', new apigateway.LambdaIntegration(answerLambda));

    apiGateway.root
      .addResource('question')
      .addMethod('GET', new apigateway.LambdaIntegration(questionLambda));
  }
}

export const createDcmDxPjHealthcheckWebFormStack = async (
  scope: Construct,
  id: string,
  props: DcmDxPjHealthcheckWebFormStackProps
): Promise<cdk.Stack> => {
  return new DcmDxPjHealthcheckWebFormStack(scope, id, props);
};
