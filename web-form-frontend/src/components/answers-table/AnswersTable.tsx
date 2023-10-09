import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { Auth } from 'aws-amplify';
import {
  AnswerPerQuestion,
  AnswersTableHeader,
  AnswersTableMetaData,
  AnswersTableResponse
} from '../../interface/AnswersTable';
import TableHeader from './TableHeader';
import TableToolbar from './TableToolbar';
import { fetchAnswers, deleteAnswers } from '../../api/index';
import ConfirmModal from '../common/ConfirmModal';

const AnswersTable: React.FC = () => {
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [headers, setHeaders] = useState<AnswersTableHeader[]>([]);
  const [metaData, setMetaData] = useState<AnswersTableMetaData[]>([]);
  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const questionnairId: number = Number(location.pathname.split('/')[2]);
  const initialQuestionnairName: string | undefined =
    location.state === null
      ? undefined
      : (location.state.questionnairName as string);

  useEffect(() => {
    if (!initialQuestionnairName) {
      navigate('/');
    } else {
      setQuestionnairName(initialQuestionnairName);
    }
    (async () => {
      const response: AnswersTableResponse = await fetchAnswers(
        questionnairId,
        limit,
        page * limit
      );

      setHeaders(response.headers);
      setMetaData(response.answers);
      setTotalCount(response.totalCount);
    })();
  }, [page, limit]);

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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = metaData.map((answer) => answer.metadataId);
      setSelected(newSelected.map(Number));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    if (selectedIndex === -1) {
      setSelected([...selected, id]);
      return;
    }
    setSelected(selected.filter((selectedId: number) => selectedId !== id));
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const updateAnswer = (
    answers: AnswersTableMetaData,
    headers: AnswersTableHeader[]
  ): AnswerPerQuestion[] => {
    const answersWithItemId: AnswerPerQuestion[] = answers.answer.filter(
      (data) => 'itemId' in data
    );

    const sameIds: number[] = Array.from(
      new Set(
        answersWithItemId.map((answer) => {
          return answer.id;
        })
      )
    );

    const uniqueIds: number[] = Array.from(
      new Set(
        answers.answer.map((answer) => {
          return answer.id;
        })
      )
    );

    const combinedAnswers: AnswerPerQuestion[] = sameIds.map((id) => {
      return {
        id: id,
        itemName: answersWithItemId
          .filter((answer) => answer.id === id)
          .map((answer) => {
            return answer.textAnswer ? answer.textAnswer : answer.itemName;
          })
          .join(',')
      };
    });

    const formedAnswer: AnswerPerQuestion[] = uniqueIds.map((id) => {
      if (sameIds.indexOf(id) === -1) {
        const index = answers.answer.findIndex((answer) => answer.id === id);
        return {
          id: id,
          itemName: answers.answer[index].textAnswer
            ? answers.answer[index].textAnswer
            : answers.answer[index].itemName
        };
      }
      const index = combinedAnswers.findIndex((answer) => answer.id === id);
      return {
        id: id,
        itemName: combinedAnswers[index].itemName
      };
    });

    const answersWithHeadersId: AnswerPerQuestion[] = headers.map((header) => {
      const index = formedAnswer.findIndex((answer) => answer.id === header.id);
      if (index === -1) {
        return {
          id: header.id,
          itemName: ''
        };
      }
      return {
        id: header.id,
        itemName: formedAnswer[index].itemName
      };
    });
    return answersWithHeadersId;
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar
          questionnairName={questionnairName}
          headers={headers}
          totalCount={totalCount}
          selected={selected}
          setIsModalOpen={setIsModalOpen}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHeader
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              totalCount={totalCount}
              headers={headers}
            />
            <TableBody>
              {metaData.map((answer: AnswersTableMetaData) => {
                const isItemSelected = isSelected(answer.metadataId);
                const labelId = `enhanced-table-checkbox-${answer.metadataId}`;
                const formedAnswer: AnswerPerQuestion[] = updateAnswer(
                  answer,
                  headers
                );
                return (
                  <TableRow
                    hover
                    onClick={(event: React.MouseEvent<unknown>) =>
                      handleClick(event, answer.metadataId)
                    }
                    role="checkbox"
                    aria-checked={isItemSelected}
                    key={answer.metadataId}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell>{String(answer.metadataId)}</TableCell>
                    {formedAnswer.map((answer, index) => {
                      return (
                        <TableCell key={index}>{answer.itemName}</TableCell>
                      );
                    })}
                    <TableCell>{answer.userId}</TableCell>
                    <TableCell>{answer.answeredDate}</TableCell>
                    <TableCell>{answer.updateUser}</TableCell>
                    <TableCell>{answer.updatedDate}</TableCell>
                  </TableRow>
                );
              })}
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
      <ConfirmModal
        isOpen={isModalOpen}
        question={`ID${selected.join(',')}の回答を削除してよろしいですか？`}
        handleClose={handleModalClose}
        execute={async () => {
          const user = await Auth.currentAuthenticatedUser();
          await deleteAnswers(
            [...selected],
            user.username,
            questionnairId
          );
          window.location.reload();
        }}
        quit={handleModalClose}
      />
    </Box>
  );
};

export default AnswersTable;
