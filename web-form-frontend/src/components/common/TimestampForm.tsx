import { Dispatch, SetStateAction } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/ja';
import { Dayjs } from 'dayjs';

type TimestampFormProps = {
  timestamp: Dayjs | null;
  setter: Dispatch<SetStateAction<Dayjs | null>>;
};

const TimestampForm: React.FC<TimestampFormProps> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ja'}>
      <DateTimePicker
        ampm={false}
        onChange={(newTimestamp: Dayjs | null) => props.setter(newTimestamp)}
        value={props.timestamp}
      />
    </LocalizationProvider>
  );
};

export default TimestampForm;
