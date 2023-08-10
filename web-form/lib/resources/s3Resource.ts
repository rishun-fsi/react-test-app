import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class FrontendS3Resource extends Stack {
  public createResources(scope: Construct): s3.Bucket {
    const stage = this.node.tryGetContext('stage');

    const bucket = new s3.Bucket(
      scope,
      `dcm-dx-pj-helthcheck-web-form-frontend-s3-${stage}`,
      {
        bucketName: `dcm-dx-pj-helthcheck-web-form-frontend-s3-${stage}`,
        removalPolicy: RemovalPolicy.DESTROY
      }
    );

    return bucket;
  }
}
