import {
  ChangeEventHandler,
  useState,
  Dispatch,
  SetStateAction,
  MouseEvent
} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import { ExistingQuestion, EditingQuestion } from '../../interface/Question';
import EditableQuestionCard from './EditableQuestionCard';
import AddQuestionButton from './AddQuestionButton';
import InheritanceForm from './InheritanceForm';
import Snackbar from '../common/Snackbar';
import { Inheritance } from '../../interface/Inheritance';

type EditableQuestionnairProps = {
  questionnairName: string;
  handleChangeQuestionnairName: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  questions: EditingQuestion[];
  handleSelectChange: Function;
  addQuestion: Function;
  deleteQuestion: Function;
  updateQuestion: Function;
  addQuestionItem: Function;
  deleteQuestionItem: Function;
  updateQuestionItem: Function;
  switchOrder: Function;
  save: Function;
  inheritance: Inheritance;
  setInheritance: Dispatch<SetStateAction<Inheritance>>;
  restoreQuestion?: Function;
  restoreQuestionItem?: Function;
  canSave?: boolean;
};

const isTooltipButton = (element: HTMLElement, ariaLabel: string): boolean => {
  return (
    element.ariaLabel === ariaLabel ||
    element.parentElement!.ariaLabel === ariaLabel ||
    element.parentElement!.parentElement!.ariaLabel === ariaLabel
  );
};

const isNamedButton = (
  element: HTMLElement,
  ariaLabel: string,
  className: string
): boolean => {
  return (
    isTooltipButton(element, ariaLabel) &&
    (element.classList.contains(className) ||
      element.parentElement!.classList.contains(className) ||
      element.parentElement!.parentElement!.classList.contains(className))
  );
};

const onClickCard =
  (setIndex: Dispatch<SetStateAction<number>>) =>
  (index: number) =>
  (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      isTooltipButton(target, '上へ') ||
      isTooltipButton(target, '下へ') ||
      isNamedButton(target, '削除', 'delete-question-button') ||
      isNamedButton(target, '復元', 'restore-question-button')
    )
      return;
    setIndex(index);
  };

const canSave = (
  questionnairName: string,
  questions: EditingQuestion[],
  isInheritanceError: boolean,
  addedSaveCondition: boolean
): boolean => {
  const existQuestionnairName: boolean = questionnairName !== '';
  const existAtLeastOneQuestion: boolean = questions.length > 0;
  const existAllHeadline: boolean = questions.every(
    (question) => question.headline !== ''
  );
  const existAllQuestionBody: boolean = questions.every(
    (question) => question.question !== ''
  );
  const existAtLeastOneOptionPerQuestion: boolean = questions.every(
    (question) =>
      question.type === 'text' ||
      question.type === 'number' ||
      question.items!.length > 0
  );

  return (
    existQuestionnairName &&
    existAtLeastOneQuestion &&
    existAllHeadline &&
    existAllQuestionBody &&
    existAtLeastOneOptionPerQuestion &&
    !isInheritanceError &&
    addedSaveCondition
  );
};

const createInheritance = (
  isSameUser: boolean,
  inheritanceQuestionIndex: number,
  questions: EditingQuestion[]
): Inheritance => {
  if (inheritanceQuestionIndex === -1) {
    return { isSameUser };
  }
  if ('isDeleted' in questions[inheritanceQuestionIndex]) {
    return { isSameUser, questionId: questions[inheritanceQuestionIndex].id };
  }

  return { isSameUser, questionIndex: inheritanceQuestionIndex };
};

const EditableQuestionnair: React.FC<EditableQuestionnairProps> = (props) => {
  const questionnairName: string = props.questionnairName;
  const handleChangeQuestionnairName = props.handleChangeQuestionnairName;
  const questions: EditingQuestion[] = props.questions;
  const handleSelectChange: Function = props.handleSelectChange;
  const addQuestion: Function = props.addQuestion;
  const deleteQuestion: Function = props.deleteQuestion;
  const updateQuestion: Function = props.updateQuestion;
  const addQuestionItem: Function = props.addQuestionItem;
  const deleteQuestionItem: Function = props.deleteQuestionItem;
  const updateQuestionItem: Function = props.updateQuestionItem;
  const switchOrder: Function = props.switchOrder;
  const restoreQuestion: Function =
    props.restoreQuestion !== undefined
      ? props.restoreQuestion
      : () => () => {};
  const restoreQuestionItem: Function | undefined = props.restoreQuestionItem;
  const save: Function = props.save;
  const addedSaveCondition: boolean =
    props.canSave === undefined ? true : props.canSave;

  const [focusingQuestionIndex, setFocusingQuestionIndex] =
    useState<number>(-1);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();

  const isInheritance = questions.some(
    (question: EditingQuestion) => question.canInherit
  );
  const inheritanceQuestionIndex: number = questions.findIndex(
    (question) => question.id === props.inheritance.questionId!
  );

  const inheritanceOptions = questions
    .filter(
      (question: EditingQuestion) =>
        !('isDeleted' in question && question.isDeleted) &&
        question.type !== 'check'
    )
    .map((question: EditingQuestion) => ({
      id: question.id,
      name: question.headline
    }));

  const isInheritanceError: boolean =
    props.inheritance.questionId! === 0 && !props.inheritance.isSameUser;

  return (
    <>
      <div>
        <TextField
          label="アンケート名"
          variant="standard"
          sx={{ margin: '0.5em', width: '30%' }}
          value={questionnairName}
          onChange={handleChangeQuestionnairName}
        />
      </div>
      {isInheritance ? (
        <div>
          <InheritanceForm
            options={inheritanceOptions}
            inheritance={props.inheritance}
            setInheritance={props.setInheritance}
            isError={isInheritanceError}
          />
        </div>
      ) : (
        <></>
      )}
      {questions.map((question: EditingQuestion, index: number) => (
        <EditableQuestionCard
          question={question}
          key={index}
          index={index}
          handleSelectChange={handleSelectChange}
          deleteQuestion={deleteQuestion(setFocusingQuestionIndex)}
          updateQuestion={updateQuestion}
          addQuestionItem={addQuestionItem}
          deleteQuestionItem={deleteQuestionItem}
          updateQuestionItem={updateQuestionItem}
          switchOrder={switchOrder(setFocusingQuestionIndex)}
          restoreQuestion={restoreQuestion(setFocusingQuestionIndex)}
          restoreQuestionItem={restoreQuestionItem}
          isBottom={
            index === questions.length - 1 ||
            ('isDeleted' in questions[index + 1] &&
              (questions[index + 1] as ExistingQuestion).isDeleted)
          }
          isFocusing={index === focusingQuestionIndex}
          deletable={
            !(isInheritance && props.inheritance.questionId === question.id)
          }
          onClick={onClickCard(setFocusingQuestionIndex)(index)}
        />
      ))}
      <AddQuestionButton addQuestion={addQuestion(setFocusingQuestionIndex)} />
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
        onClick={() => {
          try {
            if (isInheritance) {
              save(
                questionnairName,
                questions,
                createInheritance(
                  props.inheritance.isSameUser,
                  inheritanceQuestionIndex,
                  questions
                )
              )();
            } else {
              save(questionnairName, questions)();
            }
          } catch (error) {
            setIsError(true);
          }
          setIsSaved(true);
        }}
        disabled={
          !canSave(
            questionnairName,
            questions,
            isInheritanceError,
            addedSaveCondition
          ) || isSaved
        }
      >
        <SaveIcon />
        保存
      </Fab>
      {isError ? (
        <Snackbar
          open={isSaved}
          autoHideDuration={3000}
          onClose={() => {
            setIsError(false);
            setIsSaved(false);
          }}
          severity="error"
          message="エラーが発生したため、保存できませんでした。"
        />
      ) : (
        <Snackbar
          open={isSaved}
          autoHideDuration={2000}
          onClose={() => {
            navigate('/form-management');
          }}
          severity="success"
          message="変更を保存しました。自動的にフォーム管理画面に移動します。"
        />
      )}
    </>
  );
};

export default EditableQuestionnair;
