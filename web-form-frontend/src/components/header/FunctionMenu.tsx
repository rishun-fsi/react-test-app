import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

type Menu = {
  path: string;
  name: string;
  isFolded?: boolean;
  subMenu?: Menu[];
};

const FunctionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const navigate = useNavigate();

  const handleDrawerOpen = (status: boolean) => () => {
    setIsOpen(status);
  };

  const onClickMenuButton = (status: boolean, path: string) => () => {
    handleDrawerOpen(status)();
    navigate(path);
  };

  const toggleSubMenu = (name: string) => {
    setSelected(selected === name ? '' : name);
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
    {
      name: 'お知らせ管理',
      path: '/',
      isFolded: true,
      subMenu: [
        { name: 'お知らせ登録', path: '/notification-register'},
        { name: 'お知らせ編集', path: '/notification-editor' }
      ]
    }
  ];

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen(!isOpen)}
        edge="start"
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={handleDrawerOpen(false)}>
        <List>
          {menuList.map((menu: Menu, index: number) => (
            <div key={menu.name}>
              <ListItemButton
                divider
                onClick={() => {
                  if (menu.isFolded) {
                    toggleSubMenu(menu.name);
                  } else {
                    onClickMenuButton(false, menu.path)();
                  }
                }}
              >
                <ListItemText primary={menu.name} />
                {menu.isFolded && (selected === menu.name ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ListItemButton>
              {menu.isFolded && selected === menu.name && menu.subMenu && menu.subMenu.length > 0 && (
                <List sx={{ border: '1px solid #e0e0e0', margin: '0 0 0 10px' }}>
                  {menu.subMenu.map((subMenu: Menu, subIndex: number) => (
                    <div key={subMenu.name}>
                      <ListItemButton
                        onClick={onClickMenuButton(false, subMenu.path)}
                        sx={{ paddingLeft: 4 }}
                      >
                        <ListItemText primary={subMenu.name} />
                      </ListItemButton>
                      {subMenu.subMenu && subMenu.subMenu.length > 0 && (
                        <List sx={{ border: '1px solid #e0e0e0', margin: '0 0 0 10px' }}>
                          {subMenu.subMenu.map((subSubMenu: Menu, subSubIndex: number) => (
                            <div key={subSubMenu.name}>
                              <ListItemButton
                                onClick={onClickMenuButton(false, subSubMenu.path)}
                                sx={{ paddingLeft: 8 }}
                              >
                                <ListItemText primary={subSubMenu.name} />
                              </ListItemButton>
                              {subSubIndex < subMenu.subMenu!.length - 1 && <Divider />}
                            </div>
                          ))}
                        </List>
                      )}
                      {subIndex < menu.subMenu!.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
              {index < menuList.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default FunctionMenu;
