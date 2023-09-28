import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import QuestionForm from './QuestionForm';
import Accordion from '../common/Accordion';
import Snackbar from '../common/Snackbar';
import { fetchQuestions, fetchQuestionnairById } from '../../api';
import {
  FetchedQuestion,
  GroupedQuestion,
  Question,
  QuestionResponse
} from '../../interface/Question';
import { Answer } from '../../interface/Answer';
import { QuestionnairMetaData } from '../../interface/Questionnair';

type QuestionnairFormProps = {
  answers: Answer[];
  setAnswers: Dispatch<SetStateAction<Answer[]>>;
  sendAnswer: Function;
  tempPath: string;
  removeAnswer: Function;
  addAnswer: Function;
  updateDescriptionAnswer: Function;
  isEdited?: boolean;
  afterSubmitPage?: string;
};

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
  questionResponse: FetchedQuestion[]
): Question[] => {
  return questionResponse
    .map((question: FetchedQuestion): Question | Question[] => {
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

const QuestionnairForm: React.FC<QuestionnairFormProps> = (props) => {
  const answers: Answer[] = props.answers;
  const setAnswers = props.setAnswers;
  const isEdited: boolean =
    props.isEdited !== undefined ? props.isEdited : true;

  const navigate = useNavigate();
  const location = useLocation();
  const questionnairId: number = Number(location.pathname.split('/')[2]);

  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [questions, setQuestions] = useState<FetchedQuestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>('回答の送信が完了しました。');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response: QuestionResponse = await fetchQuestions(
        questionnairId,
        false
      );
      setQuestions(response.questions);

      const metadata: QuestionnairMetaData = await fetchQuestionnairById(
        questionnairId
      );

      setQuestionnairName(metadata.name);
    })();
  }, [questionnairId]);

  const requiredQuestionIds: number[] = expandQuestionResponse(questions)
    .filter((question: Question) => question.required)
    .map((question: Question): number => question.id);
  const numberQuestionIds: number[] = expandQuestionResponse(questions)
    .filter((question: Question) => question.type === 'number')
    .map((question: Question) => question.id);

  const isFilledRequired = requiredQuestionIds.every((questionId: number) => {
    return (
      answers.filter((answer: Answer) => answer.questionId === questionId)
        .length !== 0
    );
  });
  const isAllNumberAnswerOK = numberQuestionIds.every((questionId: number) => {
    const index: number = answers.findIndex(
      (answer) => answer.questionId === questionId
    );
    if (index === -1) return true;

    return !isNaN(Number(answers[index].textAnswer!));
  });
  const canSubmit =
    isFilledRequired && isAllNumberAnswerOK && !isSubmitted && isEdited;

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleSnackbarOpen = () => setIsSnackbarOpen(true);
  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);

    if (props.afterSubmitPage !== undefined && isSubmitted)
      navigate(props.afterSubmitPage, {
        state: {
          questionnairName
        }
      });
  };

  const submit = async () => {
    try {
      await props.sendAnswer();
      setSeverity('success');
      setSnackbarMessage('回答の送信が完了しました。');
      handleSnackbarOpen();
      setIsSubmitted(true);
    } catch (e) {
      setSnackbarMessage('回答の送信時にエラーが発生しました。');
      setSeverity('error');
      handleSnackbarOpen();
    }

    handleModalClose();
  };

  const updateAnswer =
    (questionId: number) =>
    (itemId?: number, textAnswer?: string): void => {
      const newAnswer: Answer = { questionId, itemId, textAnswer };

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
      const previousAnswer: Answer = answers.find(
        (answer: Answer) => answer.questionId === newAnswer.questionId
      )!;
      setAnswers([...otherAnswers, { ...previousAnswer, ...newAnswer }]);
    };

  const saveTemporary = () => {
    localStorage.setItem(props.tempPath, JSON.stringify(answers));

    setSeverity('success');
    setSnackbarMessage('回答を一時的に保存しました。');
    handleSnackbarOpen();
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
              headline={question.group}
              content={question.questions.map((questionInGroup: Question) => {
                return (
                  <QuestionForm
                    question={questionInGroup}
                    answers={extractAnswersforTargetQuestion(
                      answers,
                      questionInGroup.id
                    )}
                    key={questionInGroup.id}
                    updateAnswer={updateAnswer}
                    addAnswer={props.addAnswer}
                    removeAnswer={props.removeAnswer}
                    updateDescriptionAnswer={props.updateDescriptionAnswer}
                  ></QuestionForm>
                );
              })}
              sx={{ marginTop: '0.5em' }}
              key={`group-${question.groupId}`}
            ></Accordion>
          );
        }
        return (
          <QuestionForm
            question={question}
            answers={extractAnswersforTargetQuestion(answers, question.id)}
            key={question.id}
            updateAnswer={updateAnswer}
            addAnswer={props.addAnswer}
            removeAnswer={props.removeAnswer}
            updateDescriptionAnswer={props.updateDescriptionAnswer}
          ></QuestionForm>
        );
      })}
      <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
        <Button
          variant="contained"
          onClick={saveTemporary}
          disabled={answers.length === 0 || isSubmitted || !isEdited}
        >
          一時保存
        </Button>
        <Button
          variant="contained"
          onClick={handleModalOpen}
          disabled={!canSubmit}
        >
          {`${props.isEdited === undefined ? '回答' : '編集'}`}
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
        severity={severity}
        message={snackbarMessage}
      />
    </>
  );
};

export default QuestionnairForm;
