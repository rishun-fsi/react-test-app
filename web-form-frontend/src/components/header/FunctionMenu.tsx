import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

type Menu = {
  path: string;
  name: string;
  isFolded?: boolean;
};

const FunctionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleDrawerOpen = (status: boolean) => () => {
    setIsOpen(status);
  };

  const onClickMenuButton = (status: boolean, path: string) => () => {
    handleDrawerOpen(status)();
    handleCloseNestedMenu();
    navigate(path);
  };

  const openNestedMenu =
    (name: string) => (event: React.MouseEvent<HTMLElement>) => {
      setSelected(name);
      setAnchorEl(event.currentTarget);
    };

  const handleCloseNestedMenu = () => {
    setAnchorEl(null);
    setSelected('');
  };

  const menuList: Menu[] = [
    { name: 'トップ', path: '/', isFolded: false },
    { name: 'アンケート入力', path: '/form-answer/1', isFolded: false },
    { name: 'フォーム回答一覧', path: '/form-answers-table', isFolded: false },
    { name: 'レポート出力', path: '/', isFolded: false },
    { name: 'ユーザ管理', path: '/', isFolded: false },
    { name: 'プロダクト管理', path: '/', isFolded: false },
    { name: 'フォーム管理', path: '/form-management', isFolded: false },
    { name: 'ファイル入出力', path: '/file-io', isFolded: false },
    { name: 'お知らせ管理', path: '/', isFolded: true }
  ];

  const nestedMenu: { [name: string]: Menu[] } = {
    お知らせ管理: [
      { name: 'お知らせ登録', path: '/notification-register' },
      { name: 'お知らせ編集', path: '/' }
    ],
    '': []
  };

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
              onClick={
                menu.isFolded!
                  ? openNestedMenu(menu.name)
                  : onClickMenuButton(false, menu.path)
              }
              key={menu.name}
            >
              <ListItemText primary={menu.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      {Boolean(anchorEl) ? (
        <MuiMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNestedMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {nestedMenu[selected].map((menu: Menu) => (
            <MenuItem
              onClick={onClickMenuButton(false, menu.path)}
              key={menu.name}
            >
              {menu.name}
            </MenuItem>
          ))}
        </MuiMenu>
      ) : (
        <></>
      )}
    </>
  );
};

export default FunctionMenu;
