import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import {
  QuestionnairGetResponse,
  QuestionnairMetaData
} from '../../interface/Questionnair';
import { fetchQuestionnairs } from '../../api';

const QuestionnairsTable: React.FC = () => {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<QuestionnairMetaData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    (async () => {
      const response: QuestionnairGetResponse = await fetchQuestionnairs(
        limit,
        page * limit,
        false
      );

      setMetadata(response.questionnairs);
      setTotalCount(response.totalCount);
    })();
  }, [page, limit]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableBody>
              {metadata.map((questionnair: QuestionnairMetaData) => (
                <TableRow key={questionnair.id}>
                  <TableCell align="left">{questionnair.name}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained">権限</Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(`/form-edit/${questionnair.id}`, {
                          state: { questionnairName: questionnair.name }
                        });
                      }}
                      aria-label="edit"
                    >
                      編集
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="warning">
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default QuestionnairsTable;
