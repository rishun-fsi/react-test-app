import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';

export class CodePipelineResource {
  private sourceAction: codepipelineActions.CodeCommitSourceAction;
  private buildAction: codepipelineActions.CodeBuildAction;
  private buildOutput: codepipeline.Artifact;
  private sourceOutput: codepipeline.Artifact;

  constructor(
    scope: Construct,
    project: codebuild.PipelineProject,
    repositoryName: string,
    branchName: string
  ) {
    this.sourceOutput = new codepipeline.Artifact();
    this.buildOutput = new codepipeline.Artifact();
    const repository = codecommit.Repository.fromRepositoryName(
      scope,
      repositoryName,
      repositoryName
    );

    this.sourceAction = new codepipelineActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository,
      output: this.sourceOutput,
      branch: branchName
    });

    this.buildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: this.sourceOutput,
      outputs: [this.buildOutput]
    });
  }

  public createFrontendResource(scope: Construct): codepipeline.Pipeline {
    const targetBucket = s3.Bucket.fromBucketArn(
      scope,
      'targetBucket',
      'arn:aws:s3:::dcm-dx-pj-helthcheck-web-form-frontend-s3-dev'
    );

    const deployAction = new codepipelineActions.S3DeployAction({
      actionName: 'S3Deploy',
      bucket: targetBucket,
      input: this.buildOutput
    });

    const pipeline = new codepipeline.Pipeline(
      scope,
      'dcm-dx-pj-helthcheck-web-form-frontend-cicd-pipeline',
      {
        pipelineName: 'dcm-dx-pj-helthcheck-web-form-frontend-cicd-pipeline',
        stages: [
          {
            stageName: 'Source',
            actions: [this.sourceAction]
          },
          {
            stageName: 'Build',
            actions: [this.buildAction]
          },
          {
            stageName: 'Deploy',
            actions: [deployAction]
          }
        ]
      }
    );

    const policies: iam.PolicyStatement[] = this.createFrontendPipelinePolicies(
      scope,
      targetBucket.bucketArn,
      pipeline.artifactBucket.bucketArn
    );
    policies.map((policy) => pipeline.addToRolePolicy(policy));

    return pipeline;
  }

  public createResource(scope: Construct): codepipeline.Pipeline {
    const pipeline = new codepipeline.Pipeline(
      scope,
      'dcm-dx-pj-helthcheck-web-form-cicd-pipeline',
      {
        pipelineName: 'dcm-dx-pj-helthcheck-web-form-cicd-pipeline',
        stages: [
          {
            stageName: 'Source',
            actions: [this.sourceAction]
          },
          {
            stageName: 'Build',
            actions: [this.buildAction]
          }
        ]
      }
    );
    return pipeline;
  }

  private createFrontendPipelinePolicies(
    scope: Construct,
    bucketArn: string,
    artifactBucketArn: string
  ): iam.PolicyStatement[] {
    const policies = [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          's3:PutObject',
          's3:GetObject',
          's3:GetObjectVersion',
          's3:GetObjectVersioning'
        ],
        resources: [`${bucketArn}/*`, `${artifactBucketArn}/*`]
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'codebuild:StartBuild',
          'codebuild:StopBuild',
          'codebuild:BatchGet*',
          'codebuild:Get*',
          'codebuild:List*',
          'codecommit:GetBranch',
          'codecommit:GetCommit',
          'codecommit:GetRepository',
          'codecommit:ListBranches',
          'codecommit:GetUploadArchiveStatus',
          'codecommit:UploadArchive',
          'codecommit:cancelUploadArchive',
          's3:GetBucketLocation',
          's3:ListAllMyBuckets',
          'iam:PassRole'
        ],
        resources: ['*']
      })
    ];

    return policies;
  }
}
