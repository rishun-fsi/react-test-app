import { Dispatch, SetStateAction, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  AnswerPerQuestion,
  AnswersTableHeader,
  AnswersTableMetaData,
  AnswersTableResponse,
  HeaderItems
} from '../../interface/AnswersTable';
import { fetchAnswers } from '../../api/index';

type TableToolbarProps = {
  questionnairName: String;
  headers: AnswersTableHeader[];
  totalCount: number;
  selected: readonly number[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const TableToolbar: React.FC<TableToolbarProps> = (props) => {
  const [action, setAction] = useState('');

  const location = useLocation();
  const questionnairId: number = Number(location.pathname.split('/')[2]);
  const questionnairName = props.questionnairName;
  const headers = props.headers;
  const totalCount = props.totalCount;
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setAction(event.target.value);
    if (event.target.value === 'editAnswer') {
      navigate(`/form-answer-edit/${questionnairId}/${props.selected[0]}`);
    }
  };

  const downloadCSV = (csvData: string, fileName: string) => {
    const bom: Uint8Array = new Uint8Array([0xef, 0xbbb, 0xbf]);
    const blob: Blob = new Blob([bom, csvData], { type: 'text/csv' });
    const objectUrl: string = URL.createObjectURL(blob);
    const downloadLink: HTMLAnchorElement = document.createElement('a');

    downloadLink.download = fileName;
    downloadLink.href = objectUrl;
    downloadLink.click();
    downloadLink.remove();
  };

  const padZero = (num: number): string => `${('0' + num).slice(-2)}`;

  const formatTimestamp = (date: Date): string => {
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
      date.getDate()
    )}-${padZero(date.getHours())}-${padZero(date.getMinutes())}-${padZero(
      date.getSeconds()
    )}`;
  };

  const createFileName = (): string => {
    return `${questionnairName}_${formatTimestamp(new Date())}.csv`;
  };

  const formatStringForCSV = (str?: string): string => {
    if (str === undefined) return '';
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headersWithItems: AnswersTableHeader[] = headers.filter(
    (header) => 'items' in header
  );

  const formedHeadersWithItems: AnswersTableHeader[] = headersWithItems
    .map((header: AnswersTableHeader) => {
      return header.items!.map((item: HeaderItems) => {
        return {
          id: header.id,
          itemId: item.id,
          name: `${header.name}_${item.name}`
        };
      });
    })
    .flat();

  const formHeadersHaveSameIds = (id: number): AnswersTableHeader[] => {
    return formedHeadersWithItems.filter(
      (item: AnswersTableHeader) => item.id === id
    );
  };

  const formHeaders = (): AnswersTableHeader[] => {
    const formedHeaders = headers.map((header: AnswersTableHeader) => {
      if (!('items' in header)) {
        return {
          id: header.id,
          name: header.name
        };
      }
      return [...formHeadersHaveSameIds(header.id)];
    });
    return formedHeaders.flat();
  };

  const convertHeadersToCSV = (formedHeaders: AnswersTableHeader[]): string => {
    const headersToCSV: string = formedHeaders
      .map((header: AnswersTableHeader) => formatStringForCSV(header.name))
      .join(',');
    return `ID,${headersToCSV},回答者,回答日,更新者,更新日\r\n`;
  };

  const formAnswers = (
    metaData: AnswersTableMetaData[],
    formedHeaders: AnswersTableHeader[]
  ): AnswerPerQuestion[][] => {
    return metaData.map((answers: AnswersTableMetaData) => {
      return formedHeaders.map((header: AnswersTableHeader) => {
        const indexEqualId = answers.answer.findIndex(
          (answer) => answer.id === header.id
        );
        const indexEqualItemId = answers.answer.findIndex(
          (answer) => answer.itemId === header.itemId
        );

        if (indexEqualId === -1) {
          //headerのquestionIdに対応するanswerがない場合
          return {
            id: header.id,
            itemName: ''
          };
        }
        if (!('itemId' in answers.answer[indexEqualId])) {
          //answerがitemIdを持っていない場合
          return {
            id: header.id,
            itemName: answers.answer[indexEqualId].textAnswer
              ? answers.answer[indexEqualId].textAnswer
              : answers.answer[indexEqualId].itemName
          };
        }
        if (indexEqualItemId === -1) {
          //answerがitemIdを持っているが、対応するItemIdでない場合
          return {
            id: header.id,
            itemName: ''
          };
        }
        if (answers.answer[indexEqualId].textAnswer) {
          //answerがitemIdを持っており、記述形式の回答を持っている場合
          return {
            id: header.id,
            itemName: answers.answer[indexEqualId].textAnswer
          };
        }
        return {
          //answerがitemIdを持っており、対応するItemIdの場合
          id: header.id,
          itemName: '1'
        };
      });
    });
  };

  const convertAnswersToCSV = (
    metaData: AnswersTableMetaData[],
    formedAnswers: AnswerPerQuestion[][]
  ): string => {
    return metaData
      .map((answers: AnswersTableMetaData, index: number) => {
        return `${answers.metadataId},${formedAnswers[index]
          .map((answer: AnswerPerQuestion) =>
            formatStringForCSV(answer.itemName)
          )
          .join(',')},${answers.userId},${answers.answeredDate},${
          answers.updateUser === null ? '' : answers.updateUser
        },${answers.updatedDate}\r\n`;
      })
      .join('');
  };

  const createAllDownloadCSVData = (
    metaData: AnswersTableMetaData[]
  ): string => {
    const formedheaders: AnswersTableHeader[] = formHeaders();
    const formedAnswers: AnswerPerQuestion[][] = formAnswers(
      metaData,
      formedheaders
    );
    return (
      convertHeadersToCSV(formedheaders) +
      convertAnswersToCSV(metaData, formedAnswers)
    );
  };

  const handleSelectAllDownload = async (): Promise<void> => {
    const response: AnswersTableResponse = await fetchAnswers(
      questionnairId,
      totalCount,
      0
    );
    const metaData: AnswersTableMetaData[] = response.answers;
    const fileName: string = createFileName();
    const csvData: string = createAllDownloadCSVData(metaData);
    downloadCSV(csvData, fileName);
  };

  const handleSelectDelete = async (): Promise<void> => {
    props.setIsModalOpen(true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        対象フォーム：{questionnairName}
      </Typography>
      <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
        <InputLabel id="select-small-label">アクション</InputLabel>
        <Select
          id="action-select"
          value={action}
          label="アクション"
          onChange={handleChange}
        >
          <MenuItem value="allDownload" onClick={handleSelectAllDownload}>
            一括ダウンロード
          </MenuItem>
          <MenuItem value="download">ダウンロード</MenuItem>
          <MenuItem value="editAnswer" disabled={props.selected.length !== 1}>
            回答を編集
          </MenuItem>
          <MenuItem
            value="delete"
            disabled={props.selected.length < 1}
            onClick={handleSelectDelete}
          >
            削除
          </MenuItem>
        </Select>
      </FormControl>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export default TableToolbar;
