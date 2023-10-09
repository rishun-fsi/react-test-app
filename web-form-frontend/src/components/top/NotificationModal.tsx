import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { fetchNotificationDetail } from '../../api';
import { NotificationDetail } from '../../interface/Notification';

type NotificationModalProps = {
  isOpen: boolean;
  id: number;
  title: string;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const NotificationModal: React.FC<NotificationModalProps> = (props) => {
  const [notification, setNotification] = useState<NotificationDetail>({
    content: '',
    date: ''
  });
  useEffect(() => {
    (async () => {
      const detail: NotificationDetail = await fetchNotificationDetail(
        props.id
      );
      setNotification(detail);
    })();
  }, [props.id]);

  return (
    <Modal open={props.isOpen} onClose={props.handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {props.title}
        </Typography>
        <Typography variant="body2" component="h2">
          {notification.content}
        </Typography>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
