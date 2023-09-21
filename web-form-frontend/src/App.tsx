import { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { AmplifyProvider, Loader } from '@aws-amplify/ui-react';
import { AmplifyUser } from '@aws-amplify/ui';
import awsConfig from './common/aws-exports';
import Box from '@mui/material/Box';
import Header from './components/header/Header';

import '@aws-amplify/ui-react/styles.css';
import { useLocation, useNavigate } from 'react-router-dom';

type AppProps = {
  component: JSX.Element;
};

Amplify.configure(awsConfig);

const App: React.FC<AppProps> = (props) => {
  const component: JSX.Element = props.component;

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          setAuthInProgress(false);
          break;
        case 'signOut':
          setUser(null);
          setAuthInProgress(false);
          break;
        default:
      }

      if (localStorage.getItem('path') !== null) {
        const path: string = localStorage.getItem('path')!;
        localStorage.removeItem('path');
        navigate(path);
      }
    });

    if (location.pathname !== '/') {
      localStorage.setItem('path', location.pathname);
    }

    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user))
      .catch(() => {
        window.location.href = `https://${awsConfig.oauth.domain}/login?response_type=${awsConfig.oauth.responseType}&client_id=${awsConfig.aws_user_pools_web_client_id}&redirect_uri=${awsConfig.oauth.redirectSignIn}`;
        setAuthInProgress(true);
      });

    return unsubscribe;
  }, []);

  return (
    <AmplifyProvider colorMode="dark">
      {authInProgress || user === null ? (
        <Loader width="5rem" height="5rem" />
      ) : (
        <>
          <Header user={user!} />
          <Box sx={{ marginTop: '6%' }}>{component}</Box>
        </>
      )}
    </AmplifyProvider>
  );
};

export default App;
