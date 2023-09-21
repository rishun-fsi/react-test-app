import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TargetFormSelect from './TargetFormSelect';
import FileImportButtons from './FileImportButtons';

const CSVUploadPage: React.FC = () => {
  const [questionnairId, setQuestionnairId] = useState<string>('0');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setQuestionnairId(event.target.value as string);
  };

  return (
    <>
      <TargetFormSelect
        questionnairId={questionnairId}
        onChange={handleChange}
      />
      <Typography variant="body1">
        回答を一括アップロードするファイルを選択してください。（CSVファイルのみ）
      </Typography>
      <FileImportButtons
        canSelectFile={questionnairId !== '0'}
        questionnairId={Number(questionnairId)}
        setErrorMessage={setErrorMessage}
        setMessage={setMessage}
      />
      <Typography variant="body1" sx={{ marginTop: '1em' }}>
        アップロード結果
      </Typography>
      <Box
        sx={{ backgroundColor: '#e4f5f2', minHeight: 500, minWidth: '100%' }}
      >
        {errorMessage !== '' ? (
          <Typography variant="body2" sx={{ color: '#FF0000' }}>
            失敗: {errorMessage}
          </Typography>
        ) : (
          <Typography variant="body2">{message}</Typography>
        )}
      </Box>
    </>
  );
};

export default CSVUploadPage;
