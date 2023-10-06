import { Stage } from '../interface/Stage';

import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager';
import { getSecretId } from './stageSwitcher';

export const getSecret = async (key: string, stage: Stage): Promise<string> => {
  const client = new SecretsManagerClient({ region: 'ap-northeast-1' });
  const input = {
    SecretId: getSecretId(stage)
  };
  const command = new GetSecretValueCommand(input);
  const response = await client.send(command);
  if (!response.SecretString) {
    throw new Error('SecretString is not found.');
  }

  const secrets = JSON.parse(response.SecretString);
  return secrets[key];
};
