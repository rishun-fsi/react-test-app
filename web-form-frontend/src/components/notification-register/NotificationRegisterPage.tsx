import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fetchNotificationTypes } from '../../api';
import { NotificationType } from '../../interface/Notification';
import NotificationFormItem from './NotificationFormItem';

const NotificationRegisterPage: React.FC = () => {
  const [notificationTypes, setNotificationTypes] = useState<
    NotificationType[]
  >([]);

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
    <>
      <Typography variant="h4">お知らせ登録</Typography>
      {notificationItems.map((itemProps) => (
        <NotificationFormItem {...itemProps} key={itemProps.name} />
      ))}
      <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
        <Button variant="contained">一時保存</Button>
        <Button variant="contained">登録</Button>
      </Stack>
    </>
  );
};

export default NotificationRegisterPage;
