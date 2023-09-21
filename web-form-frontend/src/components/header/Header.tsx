import { useState } from 'react';
import { AmplifyUser } from '@aws-amplify/ui';
import { Auth } from 'aws-amplify';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import FunctionMenu from './FunctionMenu';

type HeaderProps = {
  user: AmplifyUser;
};

const Header: React.FC<HeaderProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = props.user;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <FunctionMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            プロダクト健康診断アンケートフォーム
          </Typography>
          {user?.attributes?.name}さん
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Stack direction="row" spacing={2}>
              <Avatar>P</Avatar>
            </Stack>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => Auth.signOut()}>サインアウト</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
