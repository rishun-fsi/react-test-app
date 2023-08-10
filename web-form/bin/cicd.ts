#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DcmDxPjHelthcheckWebFormCicdStack } from '../lib/cicdStack';

const app = new cdk.App({});
new DcmDxPjHelthcheckWebFormCicdStack(
  app,
  'dcm-dx-pj-helthcheck-web-form-stack',
  {
    env: { account: '095439996287', region: 'ap-northeast-1' }
  }
);
app.synth();
