const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID
  },
  oauth: {
    domain: process.env.REACT_APP_AWS_USER_POOLS_COGNITO_DOMAIN,
    responseType: 'code',
    redirectSignIn: process.env.REACT_APP_AWS_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.REACT_APP_AWS_REDIRECT_SIGN_OUT
  },
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID
};
export default awsConfig;
