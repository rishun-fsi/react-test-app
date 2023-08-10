import { useState, useEffect, forwardRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionForm from './QuestionForm';
import { fetchQuestions, submitAnswers } from '../api';
import {
  GroupedQuestion,
  Question,
  QuestionResponse
} from '../interface/Question';
import { Answer } from '../interface/Answer';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const expandQuestionResponse = (
  questionResponse: QuestionResponse
): Question[] => {
  return questionResponse
    .map((question: Question | GroupedQuestion): Question | Question[] => {
      if ('group' in question) {
        return question.questions;
      }

      return question;
    })
    .flat();
};

const extractAnswersforTargetQuestion = (
  answers: Answer[],
  questionId: number
): Answer[] => {
  return answers.filter((answer: Answer) => answer.questionId === questionId);
};

const QuestionnairForm: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionResponse>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>('回答の送信が完了しました。');

  useEffect(() => {
    (async () => {
      const response: QuestionResponse = await fetchQuestions(1, false);

      setQuestions(response);
    })();
  }, []);

  const requiredQuestionIds: number[] = expandQuestionResponse(questions)
    .filter((question: Question) => question.required)
    .map((question: Question): number => question.id);
  const canSubmit = requiredQuestionIds.every((questionId: number) => {
    return (
      answers.filter((answer: Answer) => answer.questionId === questionId)
        .length !== 0
    );
  });

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleSnackbarOpen = () => setIsSnackbarOpen(true);
  const handleSnackbarClose = () => setIsSnackbarOpen(false);

  const submit = async () => {
    const answerForSystem: Answer[] = answers.filter(
      (answer: Answer) => answer.questionId === 1
    );
    if (answerForSystem.length === 0) return;

    try {
      await submitAnswers({
        userId: 'test',
        questionnairId: 1,
        answers
      });

      setSeverity('success');
      setSnackbarMessage('回答の送信が完了しました。');
      handleSnackbarOpen();
    } catch (e) {
      setSnackbarMessage('回答の送信時にエラーが発生しました。');
      setSeverity('error');
    }

    handleModalClose();
  };

  const updateAnswer =
    (questionId: number) =>
    (itemId: number, other: string = ''): void => {
      const newAnswer: Answer = { questionId, itemId, other };

      if (
        answers.filter(
          (answer: Answer) => answer.questionId === newAnswer.questionId
        ).length === 0
      ) {
        setAnswers([...answers, newAnswer]);
      }

      const otherAnswers: Answer[] = answers.filter(
        (answer: Answer) => answer.questionId !== newAnswer.questionId
      );
      setAnswers([...otherAnswers, newAnswer]);
    };

  const addAnswer =
    (questionId: number) =>
    (itemId: number, other: string = ''): void => {
      const newAnswer: Answer = { questionId, itemId, other };
      setAnswers([...answers, newAnswer]);
    };

  const removeAnswer = (questionId: number) => (itemId: number) => {
    setAnswers(
      answers.filter(
        (answer: Answer) =>
          answer.questionId !== questionId || answer.itemId !== itemId
      )
    );
  };

  const updateDiscriptionAnswer =
    (questionId: number) => (itemId: number, other: string) => {
      const otherAnswers: Answer[] = answers.filter(
        (answer: Answer) =>
          answer.questionId !== questionId || answer.itemId !== itemId
      );

      setAnswers([...otherAnswers, { questionId, itemId, other }]);
    };

  if (questions.length === 0) {
    return <></>;
  }

  return (
    <>
      {questions.map((question: Question | GroupedQuestion) => {
        if ('group' in question) {
          return (
            <Accordion
              sx={{ marginTop: '0.5em' }}
              key={`group-${question.groupId}`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <Typography>{question.group}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {question.questions.map((questionInGroup: Question) => {
                  return (
                    <QuestionForm
                      question={questionInGroup}
                      answers={extractAnswersforTargetQuestion(
                        answers,
                        questionInGroup.id
                      )}
                      key={questionInGroup.id}
                      updateAnswer={updateAnswer}
                      addAnswer={addAnswer}
                      removeAnswer={removeAnswer}
                      updateDiscriptionAnswer={updateDiscriptionAnswer}
                    ></QuestionForm>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        }
        return (
          <QuestionForm
            question={question}
            answers={extractAnswersforTargetQuestion(answers, question.id)}
            key={question.id}
            updateAnswer={updateAnswer}
            addAnswer={addAnswer}
            removeAnswer={removeAnswer}
            updateDiscriptionAnswer={updateDiscriptionAnswer}
          ></QuestionForm>
        );
      })}
      <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
        {/* TODO: 一次保存機能を使えるようにする */}
        <Button variant="contained">一時保存</Button>
        <Button
          variant="contained"
          onClick={handleModalOpen}
          disabled={!canSubmit}
        >
          回答
        </Button>
      </Stack>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            回答を提出してよろしいですか？
          </Typography>
          <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
            <Button variant="contained" onClick={submit}>
              はい
            </Button>
            <Button
              variant="contained"
              onClick={handleModalClose}
              color="secondary"
            >
              いいえ
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuestionnairForm;
