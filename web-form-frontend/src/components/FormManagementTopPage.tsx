import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CardButton from './CardButton';

const headlineStyle = {
  marginTop: '0.2em',
  padding: '0.1em',
  backgroundColor: '#1976D2',
  color: '#FFFFFF'
};

const FormManagementTopPage: React.FC = () => {
  const navigate = useNavigate();

  const forms: string[] = ['プロダクト健康診断', 'プロダクト管理'];

  return (
    <>
      <Typography sx={headlineStyle} variant="h4" gutterBottom>
        フォーム新規作成
      </Typography>
      <Typography variant="h6" gutterBottom>
        フォームテンプレート
      </Typography>
      <CardButton
        headline="通常フォーム"
        discription="通常の新規フォーム"
        onClick={() => {
          navigate('/form-management/new');
        }}
      />
      <Typography sx={headlineStyle} variant="h4" gutterBottom>
        作成済みフォーム
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {forms.map((form: string) => (
              <TableRow key={form}>
                <TableCell align="left">{form}</TableCell>
                <TableCell align="right">
                  <Button variant="contained">権限</Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate('/form-edit/1', {
                        state: { questionnairName: form }
                      });
                    }}
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
    </>
  );
};

export default FormManagementTopPage;
