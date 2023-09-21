import AnswersTableQuestionnairsTable from './AnswersTableQuestionnairsTable';
import Headline from '../common/Headline';

const AnswersTableTopPage: React.FC = () => {
  return (
    <>
      <Headline headline="フォーム一覧" />
      <AnswersTableQuestionnairsTable />
    </>
  );
};

export default AnswersTableTopPage;
