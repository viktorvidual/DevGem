// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

/**
 * The Error component displays an error message along with a link to go back to the home page.
 *
 * @param {Object} props - The props passed to the Error component.
 * @param {string} props.error - The error message to be displayed.
 * @returns {JSX.Element} - JSX representing the Error component.
 */

interface Props {
  error: string;
}
export default function CustomSnackbarError({ error }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={15000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="error" onClose={() => setOpen(false)}>
        <AlertTitle>Error</AlertTitle>
        {error}</Alert>
    </Snackbar>
  );
}
