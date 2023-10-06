import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Headline from '../common/Headline';
import { Notification } from '../../interface/Notification';
import { fetchNotifications } from '../../api';
import NotificationModal from './NotificationModal';

const NotificationTable: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [targetId, setTargetId] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const fetched: Notification[] = await fetchNotifications(15, 0);
      setNotifications(fetched);
    })();
  }, []);

  const handleOpen = (isOpen: boolean) => () => setIsDetailOpen(isOpen);

  const getNotificationTitle = (id: number): string => {
    const targetNotification: Notification | undefined = notifications.find(
      (notification) => notification.id === targetId
    );

    if (targetNotification === undefined) return '';
    return targetNotification.title;
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Paper sx={{ width: '100%', mb: 2 }} variant="outlined" square>
        <Headline headline="お知らせ" />
        <TableContainer sx={{ maxHeight: 250 }}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">登録日時</TableCell>
                <TableCell align="left">種別</TableCell>
                <TableCell align="left">件名</TableCell>
                <TableCell align="left">登録者</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ overflow: 'scroll', height: '100px' }}>
              {notifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{notification.createdDate}</TableCell>
                  <TableCell>{notification.type}</TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => {
                        handleOpen(true)();
                        setTargetId(notification.id);
                      }}
                    >
                      {notification.title}
                    </Link>
                  </TableCell>
                  <TableCell>{notification.userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <NotificationModal
        isOpen={isDetailOpen}
        id={targetId}
        title={getNotificationTitle(targetId)}
        handleClose={handleOpen(false)}
      />
    </Box>
  );
};

export default NotificationTable;
