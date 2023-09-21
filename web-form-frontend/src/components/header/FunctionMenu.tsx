import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

type Menu = {
  path: string;
  name: string;
};

const FunctionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleDrawerOpen = (status: boolean) => () => {
    setIsOpen(status);
  };

  const onClickMenuButton = (status: boolean, path: string) => () => {
    handleDrawerOpen(status)();
    navigate(path);
  };

  const menuList: Menu[] = [
    { name: 'トップ', path: '/' },
    { name: 'アンケート入力', path: '/form-answer/1' },
    { name: 'フォーム回答一覧', path: '/form-answers-table' },
    { name: 'レポート出力', path: '/' },
    { name: 'ユーザ管理', path: '/' },
    { name: 'プロダクト管理', path: '/' },
    { name: 'フォーム管理', path: '/form-management' },
    { name: 'ファイル入出力', path: '/file-io' }
  ];

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen(true)}
        edge="start"
        sx={{ mr: 2, ...(isOpen && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={handleDrawerOpen(false)}>
        <List>
          {menuList.map((menu: Menu) => (
            <ListItemButton
              divider
              onClick={onClickMenuButton(false, menu.path)}
              key={menu.name}
            >
              <ListItemText primary={menu.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default FunctionMenu;
