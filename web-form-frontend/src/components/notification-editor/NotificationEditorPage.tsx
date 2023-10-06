import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fetchNotificationTypes } from '../../api';
import { NotificationType } from '../../interface/Notification';
import NotificationFormItem from '../notification-register/NotificationFormItem';
import NotificationTable from '../top/NotificationTable';
import { Box } from '@mui/material';

const NotificationEditorPage: React.FC = () => {
  const [notificationTypes, setNotificationTypes] = useState<
    NotificationType[]
  >([]);

  const [isBoxVisible, setIsBoxVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetchNotificationTypes();
      setNotificationTypes(response);
    })();
  }, []);

  const notificationItems: { name: string; inputElement: JSX.Element }[] = [
    {
      name: 'タイトル',
      inputElement: (
        <TextField sx={{ maxWidth: '60%' }} variant="outlined" fullWidth />
      )
    },
    {
      name: 'お知らせ種別',
      inputElement: (
        <Select sx={{ minWidth: '10%' }}>
          {notificationTypes.map((notificationType: NotificationType) => (
            <MenuItem value={notificationType.id} key={notificationType.id}>
              {notificationType.name}
            </MenuItem>
          ))}
        </Select>
      )
    },
    {
      name: '内容',
      inputElement: (
        <TextField
          sx={{ maxWidth: '60%' }}
          multiline
          fullWidth
          rows={4}
          variant="outlined"
        />
      )
    },
    {
      name: '掲載開始日時',
      inputElement: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker />
        </LocalizationProvider>
      )
    },
    {
      name: '掲載終了日時',
      inputElement: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker />
        </LocalizationProvider>
      )
    }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <NotificationTable onColumnClick={() => setIsBoxVisible(true)}  />
      {isBoxVisible && (
        <Box
          sx={{
            width: '90%',
            bgcolor: '#1101',
            padding: '1em'
          }}
        >
          <Typography variant="h4">お知らせ編集</Typography>
          {notificationItems.map((itemProps) => (
            <NotificationFormItem {...itemProps} key={itemProps.name} />
          ))}
          <Stack
            sx={{
              marginTop: '0.5em',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            spacing={2}
            direction="row"
          >
            <Stack spacing={2} direction="row">
              <Button variant="contained">一時保存</Button>
              <Button variant="contained">編集完了</Button>
            </Stack>
            <Button variant="contained" onClick={() => setIsBoxVisible(false)}>キャンセル</Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default NotificationEditorPage;
