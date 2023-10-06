import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AlertColor } from '@mui/material/Alert';
import { Auth } from 'aws-amplify';
import dayjs, { Dayjs } from 'dayjs';
import { fetchNotificationTypes, postNotification } from '../../api';
import {
  NotificationCreationRequest,
  NotificationFormItemProps,
  NotificationType
} from '../../interface/Notification';
import NotificationFormItem from './NotificationFormItem';
import TimestampForm from '../common/TimestampForm';
import Snackbar from '../common/Snackbar';

const convertDayjsToString = (timestamp: Dayjs): string => {
  const date: Date = timestamp.toDate();
  const padZero = (num: number): string => `${('0' + num).slice(-2)}`;

  return `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(
    date.getDate()
  )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
    date.getSeconds()
  )}`;
};

const convertStringToDayjs = (timestampString: string): Dayjs =>
  dayjs(timestampString.replaceAll('/', '-').replace(' ', 'T'));

const createNotificationCreationRequest = (
  title: string,
  typeId: number,
  content: string,
  userId: string,
  publishTimestamp: Dayjs | null,
  expireTimestamp: Dayjs | null
): NotificationCreationRequest => ({
  title,
  typeId,
  content,
  userId,
  publishTimestamp:
    publishTimestamp === null
      ? undefined
      : convertDayjsToString(publishTimestamp),
  expireTimestamp:
    expireTimestamp === null ? undefined : convertDayjsToString(expireTimestamp)
});

const isValidString = (str: string, maxLength: number) =>
  str.length > 0 && str.length <= maxLength;

const getTimestamp = (
  notification: NotificationCreationRequest,
  key: 'publishTimestamp' | 'expireTimestamp'
): Dayjs | null =>
  notification[key] !== undefined
    ? convertStringToDayjs(notification[key]!)
    : null;

const NotificationRegisterPage: React.FC = () => {
  const [notificationTypes, setNotificationTypes] = useState<
    NotificationType[]
  >([{ id: 1, name: '' }]);
  const [title, setTitle] = useState<string>('');
  const [typeId, setTypeId] = useState<number>(1);
  const [content, setContent] = useState<string>('');
  const [publishTimestamp, setPublishTimestamp] = useState<Dayjs | null>(null);
  const [expireTimestamp, setExpireTimestamp] = useState<Dayjs | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const tempPath = 'temp-new-notification';

  useEffect(() => {
    (async () => {
      const response = await fetchNotificationTypes();
      await setNotificationTypes(response);

      if (localStorage.getItem(tempPath) !== null) {
        const tempNotification: NotificationCreationRequest = JSON.parse(
          localStorage.getItem(tempPath)!
        );
        setTitle(tempNotification.title);
        setTypeId(tempNotification.typeId);
        setContent(tempNotification.content);
        setPublishTimestamp(getTimestamp(tempNotification, 'publishTimestamp'));
        setExpireTimestamp(getTimestamp(tempNotification, 'expireTimestamp'));
      }
    })();
  }, []);

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setTypeId(Number(event.target.value));
  };

  const saveTemporary = async () => {
    const user = await Auth.currentAuthenticatedUser();
    localStorage.setItem(
      tempPath,
      JSON.stringify(
        createNotificationCreationRequest(
          title,
          typeId,
          content,
          user.attributes.email,
          publishTimestamp,
          expireTimestamp
        )
      )
    );

    setSeverity('success');
    setSnackbarMessage('回答を一時的に保存しました。');
    setIsSnackbarOpen(true);
  };

  const submit = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const request: NotificationCreationRequest =
      createNotificationCreationRequest(
        title,
        typeId,
        content,
        user.attributes.email,
        publishTimestamp,
        expireTimestamp
      );
    try {
      await postNotification(request);
      setSeverity('success');
      setSnackbarMessage('お知らせを新規登録しました。');
      setIsSubmitted(true);
      if (localStorage.getItem(tempPath) !== null)
        localStorage.removeItem(tempPath);
    } catch (e) {
      setSeverity('error');
      setSnackbarMessage('お知らせを登録できませんでした。');
    } finally {
      setIsSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setIsSnackbarOpen(false);

  const isInputValid =
    isValidString(title, 200) && isValidString(content, 1000);

  const notificationItems: NotificationFormItemProps[] = [
    {
      name: 'タイトル',
      inputElement: (
        <TextField
          sx={{ maxWidth: '60%' }}
          variant="outlined"
          fullWidth
          value={title}
          onChange={handleChange(setTitle)}
          helperText={`200文字まで（現在${title.length}文字）`}
          error={!isValidString(title, 200)}
        />
      ),
      required: true
    },
    {
      name: 'お知らせ種別',
      inputElement: (
        <Select
          value={String(typeId)}
          onChange={handleSelectChange}
          sx={{ minWidth: '10%' }}
        >
          {notificationTypes.map((notificationType: NotificationType) => (
            <MenuItem value={notificationType.id} key={notificationType.id}>
              {notificationType.name}
            </MenuItem>
          ))}
        </Select>
      ),
      required: true
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
          value={content}
          onChange={handleChange(setContent)}
          helperText={`1000文字まで（現在${content.length}文字）`}
          error={!isValidString(content, 1000)}
        />
      ),
      required: true
    },
    {
      name: '掲載開始日時',
      inputElement: (
        <TimestampForm
          timestamp={publishTimestamp}
          setter={setPublishTimestamp}
        />
      )
    },
    {
      name: '掲載終了日時',
      inputElement: (
        <TimestampForm
          timestamp={expireTimestamp}
          setter={setExpireTimestamp}
        />
      )
    }
  ];

  return (
    <>
      <Typography variant="h4">お知らせ登録</Typography>
      {notificationItems.map((itemProps) => (
        <NotificationFormItem key={itemProps.name} {...itemProps} />
      ))}
      <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
        <Button variant="contained" aria-label="save" onClick={saveTemporary}>
          一時保存
        </Button>
        <Button
          variant="contained"
          aria-label="register"
          onClick={submit}
          disabled={isSubmitted || !isInputValid}
        >
          登録
        </Button>
      </Stack>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={severity}
        message={snackbarMessage}
      />
    </>
  );
};

export default NotificationRegisterPage;
