import { Stack, StackProps } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import { CodeBuildResourceStack } from './resources/codeBuildResource';
import { CodePipelineResource } from './resources/codePipelineResource';

export class DcmDxPjHelthcheckWebFormCicdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const buildProjectStack = new CodeBuildResourceStack(this);
    const buildProject: codebuild.PipelineProject =
      buildProjectStack.createResource(
        this,
        'dcm-dx-pj-helthcheck-web-form-stack-build-project',
        'buildspec.yml',
        'aws/codebuild/standard:7.0',
        false
      );

    const codePipelineBuilder = new CodePipelineResource(
      this,
      buildProject,
      'dcm-dx-pj-helthcheck-web-form',
      'master'
    );
    const pipeline: codepipeline.Pipeline =
      codePipelineBuilder.createResource(this);

    const frontendCodePipelineBuilder = new CodePipelineResource(
      this,
      buildProject,
      'dcm-dx-pj-helthcheck-web-form-frontend',
      'master'
    );
    const frontendPipeline: codepipeline.Pipeline =
      frontendCodePipelineBuilder.createFrontendResource(this);
  }
}
