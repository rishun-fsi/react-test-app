import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { fetchQuestionnairs } from '../../api';
import {
  QuestionnairGetResponse,
  QuestionnairMetaData
} from '../../interface/Questionnair';

type TargetFormSelectProps = {
  questionnairId: string;
  onChange: (event: SelectChangeEvent<any>) => void;
};

const TargetFormSelect: React.FC<TargetFormSelectProps> = (props) => {
  const [questionnairs, setQuestionnairs] = useState<QuestionnairMetaData[]>([
    {
      id: 0,
      name: '',
      userId: '',
      createdDate: '',
      updatedDate: '',
      isDeleted: false
    }
  ]);

  useEffect(() => {
    (async () => {
      let offset: number = 0;
      while (1) {
        const response: QuestionnairGetResponse = await fetchQuestionnairs(
          100,
          offset
        );
        offset += response.questionnairs.length;
        setQuestionnairs([...questionnairs, ...response.questionnairs]);
        if (offset >= response.totalCount) break;
      }
    })();
  }, []);

  return (
    <Box sx={{ maxWidth: 500, display: 'flex' }}>
      <Typography variant="h5" sx={{ marginRight: '1em' }}>
        対象フォーム
      </Typography>
      <FormControl sx={{ maxWidth: 300 }} fullWidth>
        <InputLabel>フォーム名</InputLabel>
        <Select
          value={props.questionnairId}
          label="フォーム名"
          onChange={props.onChange}
        >
          {questionnairs.map((questionnair) => (
            <MenuItem value={String(questionnair.id)} key={questionnair.id}>
              {questionnair.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TargetFormSelect;
