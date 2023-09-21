import { useEffect, useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import CardButton from '../common/CardButton';
import { useNavigate } from 'react-router-dom';
import {
  QuestionnairGetResponse,
  QuestionnairMetaData
} from '../../interface/Questionnair';
import { fetchQuestionnairs } from '../../api';

const AnswersTableQuestionnairsTable: React.FC = () => {
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
    <>
      {metadata.map((questionnair: QuestionnairMetaData) => (
        <Paper sx={{ width: '100%', mb: 1 }} key={questionnair.id}>
          <CardButton
            headline={questionnair.name}
            description=""
            onClick={() => {
              navigate(`/form-answers-table/${questionnair.id}`, {
                state: {
                  questionnairName: questionnair.name
                }
              });
            }}
          />
        </Paper>
      ))}

      <TablePagination
        component="div"
        count={totalCount}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default AnswersTableQuestionnairsTable;
