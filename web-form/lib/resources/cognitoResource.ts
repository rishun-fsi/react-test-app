import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class CognitoResource extends Stack {
  private stage: string;

  constructor() {
    super();

    this.stage = this.node.tryGetContext('stage');
  }

  public createResource(scope: Construct): cognito.UserPool {
    const userPool = new cognito.UserPool(
      scope,
      `dcm-dx-pj-helthcheck-web-form-user-pool-${this.stage}`,
      {
        userPoolName: `dcm-dx-pj-helthcheck-web-form-user-pool-${this.stage}`,
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        removalPolicy: RemovalPolicy.DESTROY
      }
    );

    userPool.addClient(
      `dcm-dx-pj-helthcheck-web-form-application-${this.stage}`,
      {
        userPoolClientName: 'PJHealthcheckWebForm',
        generateSecret: false,
        enableTokenRevocation: true,
        preventUserExistenceErrors: true
      }
    );

    return userPool;
  }
}
