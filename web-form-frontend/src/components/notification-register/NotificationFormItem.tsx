import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type NotificationFormItemProps = {
  name: string;
  inputElement: JSX.Element;
};

const NotificationFormItem: React.FC<NotificationFormItemProps> = (props) => {
  return (
    <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
      <Typography sx={{ marginTop: '1em', minWidth: '10%' }} variant="body1">
        {props.name}
      </Typography>
      {props.inputElement}
    </Stack>
  );
};

export default NotificationFormItem;
