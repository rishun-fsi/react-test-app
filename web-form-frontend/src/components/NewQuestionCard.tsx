import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
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
import { NewQuestion, QuestionTypeObject } from '../interface/Question';
import { questionTypes } from '../common/questionType';
import NewQuestionItems from './NewQuestionItems';
import ButtonWithToolTip from './ButtonWithToolTip';

type NewQuestionCardProps = {
  question: NewQuestion;
  index: number;
  handleSelectChange: Function;
  deleteQuestion: Function;
  updateQuestion: Function;
  addQuestionItem: Function;
  deleteQuestionItem: Function;
  updateQuestionItem: Function;
  switchOrder: Function;
  isBottom: boolean;
};

const NewQuestionCard: React.FC<NewQuestionCardProps> = (props) => {
  const question: NewQuestion = props.question;
  const index: number = props.index;
  const handleSelectChange: Function = props.handleSelectChange;
  const deleteQuestion: Function = props.deleteQuestion;
  const updateQuestion: Function = props.updateQuestion;
  const addQuestionItem: Function = props.addQuestionItem;
  const deleteQuestionItem: Function = props.deleteQuestionItem;
  const updateQuestionItem: Function = props.updateQuestionItem;
  const switchOrder: Function = props.switchOrder;
  const isBottom: boolean = props.isBottom;

  return (
    <Card sx={{ marginTop: '0.5em' }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          質問{index + 1}: {question.headline}
        </Typography>
        <div>
          <FormControl variant="standard" sx={{ width: '30%' }}>
            <InputLabel>質問の種類</InputLabel>
            <Select
              label="質問の種類"
              value={question.type}
              onChange={handleSelectChange(index)}
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
          onChange={updateQuestion(index, 'headline', 'string')}
        />
        <TextField
          label="質問文"
          multiline
          rows={3}
          variant="standard"
          fullWidth
          onChange={updateQuestion(index, 'question', 'string')}
          sx={{ marginTop: '0.5em' }}
        />
        {question.type !== 'text' ? (
          <NewQuestionItems
            addQuestionItem={addQuestionItem}
            updateQuestionItem={updateQuestionItem}
            deleteQuestionItem={deleteQuestionItem}
            items={question.items}
            index={index}
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
            disabled={index === 0}
          />
          <ButtonWithToolTip
            title="下へ"
            icon={<ArrowDownwardIcon />}
            onClick={switchOrder(index, false)}
            disabled={isBottom}
          />
          <FormGroup sx={{ marginLeft: 'auto' }} row>
            <FormControlLabel
              control={<Switch />}
              label="必須"
              checked={question.required}
              onChange={updateQuestion(index, 'required', 'boolean')}
            />
            <FormControlLabel
              control={<Switch />}
              label="前回回答の反映"
              checked={question.canInherit}
              onChange={updateQuestion(index, 'canInherit', 'boolean')}
            />
            <ButtonWithToolTip
              title="削除"
              icon={<DeleteIcon />}
              onClick={deleteQuestion(index)}
            />
          </FormGroup>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default NewQuestionCard;