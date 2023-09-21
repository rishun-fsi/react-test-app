import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { AnswersTableHeader } from '../../interface/AnswersTable';

type TableHeaderProps = {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount: number;
  headers: AnswersTableHeader[];
};

const TableHeader: React.FC<TableHeaderProps> = (props) => {
  const onSelectAllClick = props.onSelectAllClick;
  const numSelected = props.numSelected;
  const totalCount = props.totalCount;
  const headers = props.headers;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < totalCount}
            checked={totalCount > 0 && numSelected === totalCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all'
            }}
          />
        </TableCell>
        <TableCell>ID</TableCell>
        {headers.map((header, index) => (
          <TableCell sx={{ minWidth: 120 }} key={index}>
            {header.name}
          </TableCell>
        ))}
        <TableCell sx={{ minWidth: 120 }}>回答者</TableCell>
        <TableCell sx={{ minWidth: 120 }}>回答日</TableCell>
        <TableCell sx={{ minWidth: 120 }}>更新者</TableCell>
        <TableCell sx={{ minWidth: 120 }}>更新日</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
