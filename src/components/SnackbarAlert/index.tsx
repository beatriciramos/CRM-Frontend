import { Snackbar, Alert } from "@mui/material";

interface SnackbarAlertIProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const SnackbarAlert: React.FC<SnackbarAlertIProps> = ({
  open,
  message,
  severity = "error",
  onClose,
}) => (
  <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
    <Alert severity={severity} variant="filled" onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarAlert;
