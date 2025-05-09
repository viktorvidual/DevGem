import { resetPassword } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useState, useRef } from "react";
import { Alert } from '@mui/material';

import Avatar from '@mui/material/Avatar';
    import Button from '@mui/material/Button';
    import CssBaseline from '@mui/material/CssBaseline';
    import TextField from '@mui/material/TextField';
    import Link from '@mui/material/Link';
    import Grid from '@mui/material/Grid';
    import Box from '@mui/material/Box';
    import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
    import Typography from '@mui/material/Typography';
    import Container from '@mui/material/Container';

import Copyright from "../../common/copyright";

/**
 * Component for resetting a forgotten password.
 *
 * Renders a form for users to submit their email and receive a password reset email.
 *
 * @component
 * @returns {JSX.Element} Rendered component for resetting a forgotten password.
 * @example
 * return (
 *   <ForgottenPassword />
 * );
 */
export default function ForgottenPassword() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const emailRef = useRef();

  /**
   * Handle password reset submission.
   * @param {Event} e - The submit event.
   */
  async function handleResetPassword(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setSuccessMessage('A password reset link has been sent to your mailbox.');
    } catch (error) {
      setError(`${error.message}`);
    }

    setLoading(false);
  }

  return (

    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Password Reset
        </Typography>
        <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          inputRef = {emailRef}
        />
    
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
        </Box>
    </Box>
    {successMessage && (
        <Alert severity="success">
        {successMessage}
        </Alert>
    )}

    {error && (
     <Alert severity="error">
        {error}
      </Alert>
    )}
    <Copyright sx={{ mt: 8, mb: 4 }} />
  </Container>
);
}