import { ChangeEventHandler } from 'react';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import { ExistingQuestion, NewQuestion } from '../interface/Question';
import EditableQuestionCard from './EditableQuestionCard';
import AddQuestionButton from './AddQuestionButton';

type EditableQuestionnairProps = {
  questionnairName: string;
  handleChangeQuestionnairName: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  questions: (NewQuestion | ExistingQuestion)[];
  handleSelectChange: Function;
  addQuestion: Function;
  deleteQuestion: Function;
  updateQuestion: Function;
  addQuestionItem: Function;
  deleteQuestionItem: Function;
  updateQuestionItem: Function;
  switchOrder: Function;
  restoreQuestion?: Function;
  restoreQuestionItem?: Function;
};

const EditableQuestionnair: React.FC<EditableQuestionnairProps> = (props) => {
  const questionnairName: string = props.questionnairName;
  const handleChangeQuestionnairName = props.handleChangeQuestionnairName;
  const questions: (NewQuestion | ExistingQuestion)[] = props.questions;
  const handleSelectChange: Function = props.handleSelectChange;
  const addQuestion: Function = props.addQuestion;
  const deleteQuestion: Function = props.deleteQuestion;
  const updateQuestion: Function = props.updateQuestion;
  const addQuestionItem: Function = props.addQuestionItem;
  const deleteQuestionItem: Function = props.deleteQuestionItem;
  const updateQuestionItem: Function = props.updateQuestionItem;
  const switchOrder: Function = props.switchOrder;
  const restoreQuestion: Function | undefined = props.restoreQuestion;
  const restoreQuestionItem: Function | undefined = props.restoreQuestionItem;

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
      {questions.map(
        (question: NewQuestion | ExistingQuestion, index: number) => (
          <EditableQuestionCard
            question={question}
            key={index}
            index={index}
            handleSelectChange={handleSelectChange}
            deleteQuestion={deleteQuestion}
            updateQuestion={updateQuestion}
            addQuestionItem={addQuestionItem}
            deleteQuestionItem={deleteQuestionItem}
            updateQuestionItem={updateQuestionItem}
            switchOrder={switchOrder}
            restoreQuestion={restoreQuestion}
            restoreQuestionItem={restoreQuestionItem}
            isBottom={
              index === questions.length - 1 ||
              ('isDeleted' in questions[index + 1] &&
                (questions[index + 1] as ExistingQuestion).isDeleted)
            }
          />
        )
      )}
      <AddQuestionButton addQuestion={addQuestion} />
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

export default EditableQuestionnair;
