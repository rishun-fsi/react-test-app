import { forwardRef } from 'react';
import MuiSnackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type SnackbarProps = {
  open: boolean;
  autoHideDuration: number;
  onClose: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => void;
  severity: AlertColor;
  message: string;
};

const Snackbar: React.FC<SnackbarProps> = (props) => {
  return (
    <MuiSnackbar
      open={props.open}
      autoHideDuration={props.autoHideDuration}
      onClose={props.onClose}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
