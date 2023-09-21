import { Stack } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CodeBuildResourceStack extends Stack {
  private serviceRole: iam.Role;

  constructor(scope: Construct) {
    super();

    this.serviceRole = this.createServiceRole(scope);
  }

  private createServiceRole(scope: Construct): iam.Role {
    const region: string = Stack.of(this).region;
    const account: string = Stack.of(this).account;

    const envBucket = s3.Bucket.fromBucketArn(
      scope,
      'env-bucket',
      'arn:aws:s3:::dcm-dx-pj-healthcheck-web-form-env'
    );

    return new iam.Role(
      scope,
      'dcm-dx-pj-healthcheck-web-form-codebuild-service-role',
      {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        path: '/',
        inlinePolicies: {
          codeBuildServicePolicies: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cloudformation:*'],
                resources: [
                  `arn:aws:cloudformation:${region}:${account}:stack/*`
                ]
              }),
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['ssm:GetParameter'],
                resources: [
                  `arn:aws:ssm:${region}:${account}:parameter/cdk-bootstrap/*`
                ]
              }),
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:*'],
                resources: [
                  `arn:aws:s3:::cdk-*-assets-${account}-${region}`,
                  `arn:aws:s3:::cdk-*-assets-${account}-${region}/*`,
                  'arn:aws:s3:::cdktoolkit-stagingbucket-*',
                  envBucket.bucketArn,
                  `${envBucket.bucketArn}/*`
                ]
              }),
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['iam:PassRole'],
                resources: [
                  `arn:aws:iam::${account}:role/cdk-*-role-${account}-${region}`
                ]
              }),
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cloudfront:*Invalidation'],
                resources: [
                  `arn:aws:cloudfront::${account}:distribution/EZEYH026S25BZ`
                ]
              })
            ]
          })
        }
      }
    );
  }

  public createResource(
    scope: Construct,
    id: string,
    buildSpecFileName: string,
    buildImage: string,
    isPriviledged: boolean
  ): codebuild.PipelineProject {
    const buildProject = new codebuild.PipelineProject(scope, id, {
      projectName: 'dcm-dx-pj-helthcheck-web-form-codebuild',
      buildSpec: codebuild.BuildSpec.fromSourceFilename(
        `./${buildSpecFileName}`
      ),
      role: this.serviceRole,
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId(buildImage),
        privileged: isPriviledged
      }
    });

    return buildProject;
  }
}
