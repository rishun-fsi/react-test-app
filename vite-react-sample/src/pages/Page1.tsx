import React, { useState } from 'react';
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

const userList = [
  { id: 1, name: 'User 1', role: 'Admin' },
  { id: 2, name: 'User 2', role: 'User' },
  { id: 3, name: 'User 3', role: 'Admin' },
  { id: 4, name: 'User 4', role: 'User' },
  { id: 5, name: 'User 5', role: 'Admin' },
  { id: 6, name: 'User 6', role: 'User' },
  { id: 7, name: 'User 7', role: 'Admin' },
  { id: 8, name: 'User 8', role: 'User' },
];

const UserManagement: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [availableAdminUsers, setAvailableAdminUsers] = useState(
    userList.filter((user) => user.role === 'Admin')
  );
  const [availableUserUsers, setAvailableUserUsers] = useState(
    userList.filter((user) => user.role === 'User')
  );

  const handleUserSelect = (userId: number, role: 'Admin' | 'User') => {
    const isUserSelected = selectedUsers.includes(userId);

    if (isUserSelected) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => id !== userId)
      );
    } else {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    }

    // 反対フォームのチェックを外す
    if (role === 'Admin') {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => {
          const user = userList.find((u) => u.id === id);
          return user?.role !== 'User';
        })
      );
    } else if (role === 'User') {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => {
          const user = userList.find((u) => u.id === id);
          return user?.role !== 'Admin';
        })
      );
    }
  };

  const handleMoveToRight = () => {
    selectedUsers.forEach((userId) => {
      const userIndex = userList.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        // ユーザーが右に移動する
        userList[userIndex].role = 'User';
      }
    });

    // ユーザーリストを再設定
    setAvailableAdminUsers(userList.filter((user) => user.role === 'Admin'));
    setAvailableUserUsers(userList.filter((user) => user.role === 'User'));

    setSelectedUsers([]);
  };

  const handleMoveToLeft = () => {
    selectedUsers.forEach((userId) => {
      const userIndex = userList.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        // ユーザーが左に移動する
        userList[userIndex].role = 'Admin';
      }
    });

    // ユーザーリストを再設定
    setAvailableAdminUsers(userList.filter((user) => user.role === 'Admin'));
    setAvailableUserUsers(userList.filter((user) => user.role === 'User'));

    setSelectedUsers([]);
  };

  // ArrowLeftボタンのアクティブ状態
  const isArrowLeftActive = selectedUsers.some((userId) => {
    const user = userList.find((u) => u.id === userId);
    return user?.role === 'User';
  });

  // ArrowRightボタンのアクティブ状態
  const isArrowRightActive = selectedUsers.some((userId) => {
    const user = userList.find((u) => u.id === userId);
    return user?.role === 'Admin';
  });

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Paper elevation={3}>
            <List>
              {availableAdminUsers.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleUserSelect(user.id, 'Admin')}
                >
                  <ListItemIcon>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id, 'Admin')}
                    />
                  </ListItemIcon>
                  <ListItemText primary={user.name} secondary={user.role} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '50px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={selectedUsers.length === 0 || !isArrowLeftActive}
              onClick={handleMoveToLeft}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={selectedUsers.length === 0 || !isArrowRightActive}
              onClick={handleMoveToRight}
            >
              <ArrowRight />
            </Button>
          </div>
        </Grid>
        <Grid item xs={5}>
          <Paper elevation={3}>
            <List>
              {availableUserUsers.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleUserSelect(user.id, 'User')}
                >
                  <ListItemIcon>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id, 'User')}
                    />
                  </ListItemIcon>
                  <ListItemText primary={user.name} secondary={user.role} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserManagement;
