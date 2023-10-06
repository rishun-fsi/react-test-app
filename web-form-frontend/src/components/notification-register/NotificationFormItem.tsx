import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { NotificationFormItemProps } from '../../interface/Notification';

const NotificationFormItem: React.FC<NotificationFormItemProps> = (props) => {
  const required: boolean =
    props.required !== undefined ? props.required : false;
  return (
    <Stack
      sx={{ marginTop: '0.5em', sup: { color: '#FF0000' } }}
      spacing={2}
      direction="row"
    >
      <Typography sx={{ marginTop: '1em', minWidth: '10%' }} variant="body1">
        {props.name}
        {required ? <sup>*</sup> : <></>}
      </Typography>
      {props.inputElement}
    </Stack>
  );
};

export default NotificationFormItem;
