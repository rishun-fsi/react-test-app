import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type ConfirmModalProps = {
  isOpen: boolean;
  question: string;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  execute: React.MouseEventHandler<HTMLButtonElement>;
  quit: React.MouseEventHandler<HTMLButtonElement>;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  return (
    <Modal open={props.isOpen} onClose={props.handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {props.question}
        </Typography>
        <Stack sx={{ marginTop: '0.5em' }} spacing={2} direction="row">
          <Button variant="contained" onClick={props.execute}>
            はい
          </Button>
          <Button variant="contained" onClick={props.quit} color="secondary">
            いいえ
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
