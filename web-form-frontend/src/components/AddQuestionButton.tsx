import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { QuestionTypeObject } from '../interface/Question';
import { questionTypes } from '../common/questionType';

type AddQuestionProps = { addQuestion: Function };

const AddQuestionButton: React.FC<AddQuestionProps> = (props) => {
  const addQuestion: Function = props.addQuestion;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ marginTop: '1em' }}
        startIcon={<AddCircleIcon />}
        onClick={handleClick}
      >
        質問項目追加
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {questionTypes.map((questionType: QuestionTypeObject) => (
          <MenuItem
            onClick={() => {
              addQuestion(questionType.type)();
              setAnchorEl(null);
            }}
            key={questionType.type}
          >
            {questionType.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AddQuestionButton;
