import { Button, Container, CircularProgress, AppBar, Toolbar, Typography, Badge, Avatar } from '@mui/material';
import { Mail, Assignment } from '@mui/icons-material'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {

  const getSpLoginUser = () => {

  }

  return (
    <div>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">

        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="sm">
      <p>Create React Appで作ったよ</p>
      <p>すでにSharePointにログイン(サインイン)しているので特別な認証設定なしにRestも使えます</p>
      <Button variant="contained" color="primary" onClick={getSpLoginUser}>
        SharePoint Onlineのログインユーザを画面上部に表示
      </Button>
    </Container>
    <Container maxWidth="sm">
      <p>material ui のコンポーネントも使えるよ</p>
      <div>
        <p>CircularProgress</p>
        <CircularProgress />
      </div>
      <div>
        <p>Badge</p>
        <Badge badgeContent={4} color="secondary">
          <Mail />
        </Badge>
      </div>
      <div>
        <p>Avatar</p>
        <Avatar>
          <Assignment/>
        </Avatar>
      </div>
      <div>
        <p>などなどたくさん！！！</p>
      </div>
    </Container>
  </div>
  );
}

export default App;
