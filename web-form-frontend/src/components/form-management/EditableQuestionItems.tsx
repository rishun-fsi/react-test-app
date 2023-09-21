import { useState, ChangeEvent, KeyboardEvent } from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import RestoreIcon from '@mui/icons-material/Restore';
import { EditingQuestionItem } from '../../interface/Question';
import ButtonWithToolTip from '../common/ButtonWithToolTip';

type EditableQuestionItemsProps = {
  deleteQuestionItem: Function;
  updateQuestionItem: Function;
  addQuestionItem: Function;
  restoreQuestionItem?: Function;
  items: EditingQuestionItem[];
  index: number;
  isQuestionDeleted: boolean;
};

const EditableQuestionItems: React.FC<EditableQuestionItemsProps> = (props) => {
  const deleteQuestionItem: Function = props.deleteQuestionItem;
  const updateQuestionItem: Function = props.updateQuestionItem;
  const addQuestionItem: Function = props.addQuestionItem;
  const restoreQuestionItem: Function =
    props.restoreQuestionItem !== undefined
      ? props.restoreQuestionItem
      : () => {};
  const items: EditingQuestionItem[] = props.items;
  const index: number = props.index;
  const isQuestionDeleted: boolean = props.isQuestionDeleted;

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
        {items.map((item: EditingQuestionItem, i: number) => {
          const isDeleted: boolean = 'isDeleted' in item && item.isDeleted;

          return (
            <FormGroup row key={i}>
              <TextField
                variant="standard"
                InputProps={{
                  endAdornment: !isDeleted ? (
                    <ButtonWithToolTip
                      title="削除"
                      icon={<ClearIcon />}
                      onClick={deleteQuestionItem(index, i)}
                      disabled={isQuestionDeleted || isDeleted}
                    />
                  ) : (
                    <ButtonWithToolTip
                      title="復元"
                      icon={<RestoreIcon />}
                      onClick={restoreQuestionItem(index, i)}
                    />
                  )
                }}
                value={`${item.name}${isDeleted ? '(削除済み)' : ''}`}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if ((event.target.value as string) === '') {
                    deleteQuestionItem(index, i)();
                    return;
                  }
                  updateQuestionItem(index, i, 'name')(event);
                }}
                disabled={isQuestionDeleted || isDeleted}
                sx={{ marginTop: '0.5em' }}
                aria-label="option-text-field"
              />
              <FormControlLabel
                control={<Switch disabled={isQuestionDeleted || isDeleted} />}
                label="記述式"
                onChange={updateQuestionItem(index, i, 'isDescription')}
                checked={item.isDescription}
              />
            </FormGroup>
          );
        })}
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
                disabled={newItemName === '' || isQuestionDeleted}
              />
            )
          }}
          value={newItemName}
          disabled={isQuestionDeleted}
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

export default EditableQuestionItems;
