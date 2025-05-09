import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AuthContext } from '../../context/AuthContext.ts';

export default function InfoLine() {
  const { loggedInUser } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(!!loggedInUser?.blockedStatus);

  return (
    <div>
      <Snackbar open={open} onClose={() => setOpen(false)}>
        <Alert
          onClose={() => setOpen(false)}
          variant="filled"
          severity="error"
          sx={{ width: '100%', textAlign: "left" }}>
          <AlertTitle>Blocked alert</AlertTitle>
          You have been blocked and you cannot upload or manage add-ons. Contact admin for more info.
        </Alert>
      </Snackbar>
    </div>
  );
}
