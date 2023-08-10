import { useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { SelectChangeEvent } from '@mui/material/Select';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import {
  NewQuestion,
  NewQuestionItem,
  QuestionType,
  QuestionTypeObject
} from '../interface/Question';
import NewQuestionCard from './NewQuestionCard';
import { questionTypes } from '../common/questionType';

type UpdateType = 'string' | 'boolean';

const handleSelectChange =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (index: number) =>
  (event: SelectChangeEvent) => {
    const type: QuestionType = event.target.value as QuestionType;

    const updated = questions.map((question: NewQuestion, i: number) => {
      if (i !== index) return question;

      return { ...question, type };
    });

    setQuestions(updated);
  };

const addQuestion =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>,
    setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>
  ) =>
  (type: QuestionType) =>
  () => {
    const newQuestion: NewQuestion = {
      question: '',
      type,
      required: false,
      headline: '',
      items: [],
      canInherit: false
    };

    setQuestions([...questions, newQuestion]);
    setAnchorEl(null);
  };

const deleteQuestion =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (index: number) =>
  () => {
    const deleted = questions.filter((_, i: number) => i !== index);
    setQuestions(deleted);
  };

const updateQuestion =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (index: number, key: string, valueType: UpdateType) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const updatedValue: string | boolean =
      valueType === 'string'
        ? (event.target.value as string)
        : event.target.checked;

    const updated = questions.map((question: NewQuestion, i: number) => {
      if (i !== index) return question;

      return { ...question, [key]: updatedValue };
    });

    setQuestions(updated);
  };

const deleteQuestionItem =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (questionIndex: number, itemIndex: number) =>
  () => {
    const deleted = questions.map((question: NewQuestion, i: number) => {
      if (i !== questionIndex) return question;

      return {
        ...question,
        items: question.items.filter((_, j: number) => j !== itemIndex)
      };
    });

    setQuestions(deleted);
  };

const addQuestionItem =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (index: number, newItemName: string) =>
  () => {
    const items: NewQuestionItem[] = [
      ...questions[index].items,
      { name: newItemName, isDiscription: false }
    ];
    const updated = questions.map((question: NewQuestion, i: number) => {
      if (i !== index) return question;

      return { ...question, items };
    });

    setQuestions(updated);
  };

const updateQuestionItem =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (questionIndex: number, itemIndex: number, key: string) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const updatedValue: string | boolean =
      key === 'name' ? (event.target.value as string) : event.target.checked;
    const updatedItems: NewQuestionItem[] = questions[questionIndex].items.map(
      (item: NewQuestionItem, i: number) => {
        if (i !== itemIndex) return item;

        return { ...item, [key]: updatedValue };
      }
    );
    const updated = questions.map((question: NewQuestion, i: number) => {
      if (i !== questionIndex) return question;

      return { ...question, items: updatedItems };
    });

    setQuestions(updated);
  };

const switchOrder =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (index: number, isUpward: boolean) =>
  () => {
    const switchTarget: NewQuestion = isUpward
      ? questions[index - 1]
      : questions[index + 1];
    const switching: NewQuestion = questions[index];

    const switched: NewQuestion[] = questions.map(
      (question: NewQuestion, i: number) => {
        if (index === i) {
          return switchTarget;
        } else if (
          (isUpward && i === index - 1) ||
          (!isUpward && i === index + 1)
        ) {
          return switching;
        }

        return question;
      }
    );

    setQuestions(switched);
  };

const FormManagementPage: React.FC = () => {
  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [questions, setQuestions] = useState<NewQuestion[]>([]);
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
      <div>
        <TextField
          label="アンケート名"
          variant="standard"
          sx={{ margin: '0.5em', width: '30%' }}
          value={questionnairName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setQuestionnairName(event.target.value as string);
          }}
        />
      </div>
      {questions.map((question: NewQuestion, index: number) => (
        <NewQuestionCard
          question={question}
          key={index}
          index={index}
          handleSelectChange={handleSelectChange(questions, setQuestions)}
          deleteQuestion={deleteQuestion(questions, setQuestions)}
          updateQuestion={updateQuestion(questions, setQuestions)}
          addQuestionItem={addQuestionItem(questions, setQuestions)}
          deleteQuestionItem={deleteQuestionItem(questions, setQuestions)}
          updateQuestionItem={updateQuestionItem(questions, setQuestions)}
          switchOrder={switchOrder(questions, setQuestions)}
          isBottom={index === questions.length - 1}
        />
      ))}
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
            onClick={addQuestion(
              questions,
              setQuestions,
              setAnchorEl
            )(questionType.type)}
            key={questionType.type}
          >
            {questionType.name}
          </MenuItem>
        ))}
      </Menu>
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
      >
        <SaveIcon />
        保存
      </Fab>
    </>
  );
};

export default FormManagementPage;
