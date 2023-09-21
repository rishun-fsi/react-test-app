import { useEffect, useState, MouseEventHandler } from 'react';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RestoreIcon from '@mui/icons-material/Restore';
import { EditingQuestion, QuestionTypeObject } from '../../interface/Question';
import { questionTypes } from '../../common/questionType';
import EditableQuestionItems from './EditableQuestionItems';
import ButtonWithToolTip from '../common/ButtonWithToolTip';
import Accordion from '../common/Accordion';

type EditableQuestionCardProps = {
  question: EditingQuestion;
  index: number;
  handleSelectChange: Function;
  deleteQuestion: Function;
  updateQuestion: Function;
  addQuestionItem: Function;
  deleteQuestionItem: Function;
  updateQuestionItem: Function;
  switchOrder: Function;
  restoreQuestion?: Function;
  restoreQuestionItem?: Function;
  onClick: MouseEventHandler<HTMLDivElement>;
  isBottom: boolean;
  isFocusing: boolean;
  deletable: boolean;
};

const EditableQuestionCard: React.FC<EditableQuestionCardProps> = (props) => {
  const question: EditingQuestion = props.question;
  const index: number = props.index;
  const handleSelectChange: Function = props.handleSelectChange;
  const deleteQuestion: Function = props.deleteQuestion;
  const updateQuestion: Function = props.updateQuestion;
  const addQuestionItem: Function = props.addQuestionItem;
  const deleteQuestionItem: Function = props.deleteQuestionItem;
  const updateQuestionItem: Function = props.updateQuestionItem;
  const switchOrder: Function = props.switchOrder;
  const restoreQuestion: Function =
    props.restoreQuestion !== undefined ? props.restoreQuestion : () => {};
  const restoreQuestionItem: Function | undefined = props.restoreQuestionItem;
  const onClick: MouseEventHandler<HTMLDivElement> = props.onClick;
  const isBottom: boolean = props.isBottom;
  const isFocusing: boolean = props.isFocusing;
  const deletable: boolean = props.deletable;

  const isDeleted: boolean = 'isDeleted' in question && question.isDeleted;

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, [question]);

  return (
    <Accordion
      headline={`質問${index + 1}: ${question.headline}${
        isDeleted ? '(削除済み)' : ''
      }`}
      content={
        <>
          <div>
            <FormControl variant="standard" sx={{ width: '30%' }}>
              <InputLabel>質問の種類</InputLabel>
              <Select
                label="質問の種類"
                value={question.type}
                onChange={handleSelectChange(index)}
                disabled={isDeleted}
              >
                {questionTypes.map((questionType: QuestionTypeObject) => (
                  <MenuItem key={questionType.type} value={questionType.type}>
                    {questionType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            label="見出し"
            variant="standard"
            sx={{ marginTop: '0.5em', width: '30%' }}
            value={question.headline}
            onChange={updateQuestion(index, 'headline', 'string')}
            disabled={isDeleted}
            aria-label="headline-text-field"
          />
          <TextField
            label="質問文"
            multiline
            rows={3}
            variant="standard"
            fullWidth
            value={question.question}
            onChange={updateQuestion(index, 'question', 'string')}
            sx={{ marginTop: '0.5em' }}
            disabled={isDeleted}
          />
          {question.type !== 'text' && question.type !== 'number' ? (
            <EditableQuestionItems
              addQuestionItem={addQuestionItem}
              updateQuestionItem={updateQuestionItem}
              deleteQuestionItem={deleteQuestionItem}
              restoreQuestionItem={restoreQuestionItem}
              items={question.items!}
              index={index}
              isQuestionDeleted={isDeleted}
            />
          ) : (
            <></>
          )}
          <Divider />
          <CardActions sx={{ marginTop: '0.5em' }} disableSpacing>
            <ButtonWithToolTip
              title="上へ"
              icon={<ArrowUpwardIcon />}
              onClick={switchOrder(index, true)}
              disabled={index === 0 || isDeleted}
            />
            <ButtonWithToolTip
              title="下へ"
              icon={<ArrowDownwardIcon />}
              onClick={switchOrder(index, false)}
              disabled={isBottom || isDeleted}
            />
            <FormGroup sx={{ marginLeft: 'auto' }} row>
              <FormControlLabel
                control={<Switch disabled={isDeleted} />}
                label="必須"
                checked={question.required}
                onChange={updateQuestion(index, 'required', 'boolean')}
              />
              <FormControlLabel
                control={<Switch disabled={isDeleted} />}
                label="前回回答の反映"
                checked={question.canInherit}
                onChange={updateQuestion(index, 'canInherit', 'boolean')}
              />
              {!isDeleted ? (
                <ButtonWithToolTip
                  title="削除"
                  icon={<DeleteIcon />}
                  disabled={!deletable}
                  onClick={deleteQuestion(index)}
                  className="delete-question-button"
                />
              ) : (
                <ButtonWithToolTip
                  title="復元"
                  icon={<RestoreIcon />}
                  onClick={restoreQuestion(index)}
                  className="restore-question-button"
                />
              )}
            </FormGroup>
          </CardActions>
        </>
      }
      headlineSx={{ color: isDeleted ? '#D43636' : '#535353' }}
      sx={{
        marginTop: '0.5em',
        backgroundColor: isDeleted ? '#c8c8cb' : '#fff',
        border: isFocusing ? '2px solid #1976d2' : ''
      }}
      isOpen={isOpen}
      onChange={() => {
        setIsOpen(!isOpen);
      }}
      onClick={onClick}
    />
  );
};

export default EditableQuestionCard;
