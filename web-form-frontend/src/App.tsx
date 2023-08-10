import Box from '@mui/material/Box';
import Header from './components/Header';

type AppProps = {
  component: JSX.Element;
};

const App: React.FC<AppProps> = (props) => {
  const component: JSX.Element = props.component;

  return (
    <>
      <Header />
      <Box sx={{ marginTop: '6%' }}>{component}</Box>
    </>
  );
};

export default App;
