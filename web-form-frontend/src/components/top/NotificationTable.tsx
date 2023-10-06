import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Notification } from '../../interface/Notification';
import Headline from '../common/Headline';

// Define the props interface
interface NotificationTableProps {
  onColumnClick?: () => void;
}

const notificationRows: Notification[] = [
  {
    registerDate: new Date(2023, 4, 1),
    headline: 'お知らせ1',
    content: 'xxxxxxxxxxx',
    registrant: '山田太郎'
  },
  {
    registerDate: new Date(2023, 5, 1),
    headline: 'お知らせ2',
    content: 'yyyyyyyyyyy',
    registrant: '山田次郎'
  },
  {
    registerDate: new Date(2023, 6, 1),
    headline: 'お知らせ3',
    content: 'zzzzzzzzzzz',
    registrant: '山田三郎'
  }
];

const NotificationTable: React.FC<NotificationTableProps> = ({ onColumnClick }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }} variant="outlined" square>
        <Headline headline="お知らせ" />
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">登録日時</TableCell>
                <TableCell align="left">件名</TableCell>
                <TableCell align="left">登録者</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notificationRows.map((notification, id) => (
                <TableRow
                  key={id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={onColumnClick}
                >
                  <TableCell>
                    {notification.registerDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button>{notification.headline}</Button>
                  </TableCell>
                  <TableCell>{notification.registrant}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default NotificationTable;
