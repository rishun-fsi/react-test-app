import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { AlertColor } from '@mui/material/Alert';
import QuestionForm from './QuestionForm';
import Accordion from '../common/Accordion';
import Snackbar from '../common/Snackbar';
import ConfirmModal from '../common/ConfirmModal';
import { getTempAnswers } from '../../common/answer';
import {
  fetchQuestions,
  fetchQuestionnairById,
  fetchPreviousAnswers
} from '../../api';
import {
  FetchedQuestion,
  GroupedQuestion,
  Question,
  QuestionResponse
} from '../../interface/Question';
import { Inheritance } from '../../interface/Inheritance';
import { Answer, PreviousAnswerQueryParam } from '../../interface/Answer';
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
  isInheritance: boolean;
  existTempAnswers: boolean;
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
  const isInheritance: boolean = props.isInheritance;
  const existTempAnswers: boolean = props.existTempAnswers;

  const navigate = useNavigate();
  const location = useLocation();
  const questionnairId: number = Number(location.pathname.split('/')[2]);

  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [inheritance, setInheritance] = useState<Inheritance | undefined>();
  const [isKeyQuestionChange, setIsKeyQuestionChange] =
    useState<boolean>(false);
  const [questions, setQuestions] = useState<FetchedQuestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>('回答の送信が完了しました。');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // ページが読み込まれたとき
  useEffect(() => {
    (async () => {
      const response: QuestionResponse = await fetchQuestions(
        questionnairId,
        false
      );
      setQuestions(response.questions);
      setInheritance(response.inheritance);

      if (!existTempAnswers && isInheritance && response.inheritance)
        reflectPreviousAnswer(response.inheritance);

      const metadata: QuestionnairMetaData = await fetchQuestionnairById(
        questionnairId
      );
      setQuestionnairName(metadata.name);
    })();
  }, [questionnairId]);

  // キーとなる質問を変更したとき
  useEffect(() => {
    if (isKeyQuestionChange && isInheritance && inheritance) {
      reflectPreviousAnswer(inheritance);
      setIsKeyQuestionChange(false);
    }
  }, [isKeyQuestionChange]);

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

      if (questionId !== inheritance?.questionId) return;

      if (isMatchTempAnswer(itemId, textAnswer)) {
        setAnswers(getTempAnswers(props.tempPath));
        return;
      }

      setIsKeyQuestionChange(true);
    };

  // キーとなる質問の回答が一時保存された回答と一致しているか否かを判定する
  const isMatchTempAnswer = (itemId?: number, textAnswer?: string): boolean => {
    return getTempAnswers(props.tempPath).some(
      (tempAnswer: Answer) =>
        (itemId !== undefined && itemId === tempAnswer.itemId) ||
        (textAnswer !== undefined && textAnswer === tempAnswer.textAnswer)
    );
  };

  const reflectPreviousAnswer = async (inheritance: Inheritance) => {
    // 「同一ユーザーの前回回答を参照する」にチェックが入っていて「キーとなる質問」が指定されていない場合
    if (inheritance.isSameUser && inheritance.questionId === undefined) {
      const queryParameter: PreviousAnswerQueryParam = { questionnairId };
      const previousAnswers: Answer[] | undefined = await fetchPreviousAnswers(
        queryParameter,
        inheritance!.isSameUser
      );
      if (previousAnswers !== undefined) {
        setAnswers(previousAnswers);
      }
      return;
    }

    const itemId: number | undefined = answers.find(
      (answer: Answer) => answer.questionId === inheritance.questionId
    )?.itemId;
    const textAnswer: string | undefined = answers.find(
      (answer: Answer) => answer.questionId === inheritance.questionId
    )?.textAnswer;

    if (
      inheritance.questionId !== undefined &&
      itemId === undefined &&
      textAnswer === undefined
    )
      return;

    const queryParameter: PreviousAnswerQueryParam = {
      questionnairId,
      questionId: inheritance.questionId,
      itemId,
      textAnswer
    };

    const previousAnswers: Answer[] | undefined = await fetchPreviousAnswers(
      queryParameter,
      inheritance.isSameUser
    );

    if (previousAnswers !== undefined) {
      setAnswers(
        mergeKeyQuestion(inheritance, previousAnswers, queryParameter)
      );
    } else {
      setAnswers([
        {
          questionId: queryParameter.questionId!,
          itemId: queryParameter?.itemId,
          textAnswer: queryParameter?.textAnswer
        }
      ]);
    }
  };

  // fetchPreviousAnswersでキーの質問IDに相当する回答情報が取得されていなければpreviousAnswersにマージする
  const mergeKeyQuestion = (
    inheritance: Inheritance,
    previousAnswers: Answer[],
    queryParameter: PreviousAnswerQueryParam
  ): Answer[] => {
    const isMergeKeyQuestion: boolean =
      inheritance.questionId === undefined
        ? false
        : previousAnswers
            .filter(
              (previousAnswer: Answer) =>
                previousAnswer.questionId !== undefined
            )
            .find(
              (previousAnswer: Answer) =>
                previousAnswer.questionId === inheritance.questionId
            ) === undefined
        ? true
        : false;

    if (isMergeKeyQuestion) {
      return [
        ...previousAnswers,
        {
          questionId: queryParameter.questionId!,
          itemId: queryParameter?.itemId,
          textAnswer: queryParameter?.textAnswer
        }
      ];
    }
    return previousAnswers;
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
      <ConfirmModal
        isOpen={isModalOpen}
        question="回答を提出してよろしいですか？"
        handleClose={handleModalClose}
        execute={submit}
        quit={handleModalClose}
      />
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
