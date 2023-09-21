import { Auth } from 'aws-amplify';
import { AxiosRequestConfig } from 'axios';

export const eventHeaders = async (): Promise<AxiosRequestConfig> => {
  const getAuthToken = async (): Promise<String> => {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    return token;
  };
  const token = await getAuthToken();

  return {
    headers: {
      Authorization: `${token}`
    }
  };
};
