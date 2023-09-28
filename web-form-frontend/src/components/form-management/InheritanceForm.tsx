import { Dispatch, SetStateAction } from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Inheritance } from '../../interface/Inheritance';

type Option = {
  id: number;
  name: string;
};

type InheritanceFormProps = {
  options: Option[];
  inheritance: Inheritance;
  setInheritance: Dispatch<SetStateAction<Inheritance>>;
  isError: boolean;
};

const InheritanceForm: React.FC<InheritanceFormProps> = (props) => {
  const handleSelectChange = (event: SelectChangeEvent) => {
    const id = Number(event.target.value);
    props.setInheritance({ ...props.inheritance, questionId: id });
  };

  return (
    <>
      <FormControl
        sx={{ width: '40%', marginTop: '0.5em' }}
        error={props.isError}
      >
        <InputLabel>前回回答を反映する際のキーとする質問</InputLabel>
        <Select
          labelId="select-label"
          label="前回回答を反映する際のキーとする質問"
          value={String(props.inheritance.questionId)}
          onChange={handleSelectChange}
        >
          <MenuItem value="0">指定しない</MenuItem>
          {props.options.map((option: Option) => (
            <MenuItem key={option.id} value={String(option.id)}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        {props.isError ? (
          <FormHelperText>
            同一ユーザーの前回回答を参照しない場合はキーとする質問を指定してください。
          </FormHelperText>
        ) : (
          <></>
        )}
        <FormControlLabel
          control={<Switch />}
          label="同一ユーザーの前回回答を参照する"
          checked={props.inheritance.isSameUser}
          onChange={() => {
            props.setInheritance({
              ...props.inheritance,
              isSameUser: !props.inheritance.isSameUser
            });
          }}
        />
      </FormControl>
    </>
  );
};

export default InheritanceForm;
