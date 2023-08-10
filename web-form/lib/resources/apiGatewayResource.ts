import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class ApiGatewayResource extends Stack {
  public createResources(scope: Construct, id: string): apigateway.RestApi {
    const stage = this.node.tryGetContext('stage');

    const apiGateway = new apigateway.RestApi(
      scope,
      `${id}-rest-api-${stage}`,
      {
        restApiName: `${id}-rest-api-${stage}`,
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: ['GET', 'POST', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization']
        }
      }
    );

    return apiGateway;
  }
}
