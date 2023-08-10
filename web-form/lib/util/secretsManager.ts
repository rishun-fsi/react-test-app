import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager';

export const getSecret = async (key: string): Promise<string> => {
  const client = new SecretsManagerClient({ region: 'ap-northeast-1' });
  const input = {
    SecretId: 'dcmdxpjhealthcheckwebformst-cD5kOFVF3Vo1'
  };
  const command = new GetSecretValueCommand(input);
  const response = await client.send(command);
  if (!response.SecretString) {
    throw new Error('SecretString is not found.');
  }

  const secrets = JSON.parse(response.SecretString);
  return secrets[key];
};
