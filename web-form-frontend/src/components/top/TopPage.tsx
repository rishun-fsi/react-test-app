import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NotificationTable from './NotificationTable';
import TableauDashBoard from './TableauDashBoard';

const TopPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <NotificationTable />
        <TableauDashBoard />
      </Stack>
    </Box>
  );
};

export default TopPage;
