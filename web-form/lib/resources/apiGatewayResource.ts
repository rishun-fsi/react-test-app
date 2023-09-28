import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class ApiGatewayResource extends Stack {
  public createResources(
    scope: Construct,
    id: string,
    userPool: cognito.UserPool
  ): apigateway.RestApi {
    const stage = this.node.tryGetContext('stage');

    const auth = new apigateway.CognitoUserPoolsAuthorizer(
      scope,
      `dcm-dx-pj-healthcheck-web-form-auth-${stage}`,
      {
        cognitoUserPools: [userPool]
      }
    );

    const apiGateway = new apigateway.RestApi(
      scope,
      `${id}-rest-api-${stage}`,
      {
        restApiName: `${id}-rest-api-${stage}`,
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization']
        },
        defaultMethodOptions: {
          authorizer: auth,
          authorizationType: apigateway.AuthorizationType.COGNITO
        }
      }
    );

    return apiGateway;
  }
}
