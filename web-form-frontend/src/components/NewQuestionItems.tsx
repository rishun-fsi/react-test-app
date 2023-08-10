import { useState, ChangeEvent, KeyboardEvent } from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { NewQuestionItem } from '../interface/Question';
import ButtonWithToolTip from './ButtonWithToolTip';

type NewQuestionItemsProps = {
  deleteQuestionItem: Function;
  updateQuestionItem: Function;
  addQuestionItem: Function;
  items: NewQuestionItem[];
  index: number;
};

const NewQuestionItems: React.FC<NewQuestionItemsProps> = (props) => {
  const deleteQuestionItem: Function = props.deleteQuestionItem;
  const updateQuestionItem: Function = props.updateQuestionItem;
  const addQuestionItem: Function = props.addQuestionItem;
  const items: NewQuestionItem[] = props.items;
  const index: number = props.index;

  const [newItemName, setNewItemName] = useState<string>('');

  return (
    <>
      <Typography
        gutterBottom
        variant="body1"
        component="div"
        sx={{ marginTop: '0.5em' }}
      >
        選択肢
      </Typography>
      <FormGroup sx={{ maxWidth: '50%' }}>
        {items.map((item: NewQuestionItem, i: number) => (
          <FormGroup row key={i}>
            <TextField
              variant="standard"
              InputProps={{
                endAdornment: (
                  <ButtonWithToolTip
                    title="削除"
                    icon={<ClearIcon />}
                    onClick={deleteQuestionItem(index, i)}
                  />
                )
              }}
              value={item.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if ((event.target.value as string) === '') {
                  deleteQuestionItem(index, i)();
                  return;
                }
                updateQuestionItem(index, i, 'name')(event);
              }}
              sx={{ marginTop: '0.5em' }}
            />
            <FormControlLabel
              control={<Switch />}
              label="記述式"
              onChange={updateQuestionItem(index, i, 'isDiscription')}
            />
          </FormGroup>
        ))}
        <TextField
          variant="standard"
          InputProps={{
            startAdornment: (
              <ButtonWithToolTip
                title="追加"
                icon={<AddIcon />}
                onClick={() => {
                  addQuestionItem(index, newItemName)();
                  setNewItemName('');
                }}
                disabled={newItemName === ''}
              />
            )
          }}
          value={newItemName}
          sx={{ marginTop: '0.5em', marginBottom: '0.5em' }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setNewItemName(event.target.value as string);
          }}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.keyCode === 13 && newItemName !== '') {
              addQuestionItem(index, newItemName)();
              setNewItemName('');
            }
          }}
        />
      </FormGroup>
    </>
  );
};

export default NewQuestionItems;
