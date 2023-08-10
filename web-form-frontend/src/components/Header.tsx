import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FunctionMenu from './FunctionMenu';

const Header: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <FunctionMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            プロダクト健康診断アンケートフォーム
          </Typography>
          <div>xxxx xxxxさん</div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
