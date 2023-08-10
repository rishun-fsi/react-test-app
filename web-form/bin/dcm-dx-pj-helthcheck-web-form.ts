#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { createDcmDxPjHealthcheckWebFormStack } from '../lib/dcm-dx-pj-helthcheck-web-form-stack';
import { getSecret } from '../lib/util/secretsManager';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');

process.on('unhandledRejection', (e, promise) => {
  console.error(e);
  process.exit(1);
});

(async () => {
  const password = await getSecret('password');
  await createDcmDxPjHealthcheckWebFormStack(
    app,
    `dcm-dx-pj-healthcheck-web-form-stack-${stage}`,
    {
      env: { account: '095439996287', region: 'ap-northeast-1' },
      password: password
    }
  );
  app.synth();
})();
