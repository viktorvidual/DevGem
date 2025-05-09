import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { FormEvent, useContext, useRef, useState } from "react";
import { loginUser } from "../../services/auth.services";
import { AuthContext, LoggedInUser } from "../../context/AuthContext";
import { getUserData } from "../../services/user.services";
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
import { Alert } from '@mui/material';
import { SIGN_UP_PATH, FORGOT_PASSWORD_PATH } from "../../common/common";
import Copyright from "../../common/copyright";
import { AuthError } from "firebase/auth";

/**
 * A component for user login.
 *
 * Allows users to log in using their email and password.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * );
 */
export default function Login() {

  const { setUser } = useContext(AuthContext);

  const [error, setError] = useState('');

  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };


  /**
   * Handle form submission for user login.
   * @param {Event} e - The form submission event.
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = emailRef.current && passwordRef.current && await loginUser(
        emailRef.current.value,
        passwordRef.current.value
      );
      (async () => {
        const loggedUserSnapshot = data && await getUserData(data.user.uid);

        const loggedInUser: LoggedInUser | undefined = loggedUserSnapshot && (Object.values(loggedUserSnapshot.val()).find(
          (el) => (el as LoggedInUser).uid === data.user.uid
        ) as LoggedInUser | undefined
        );
        if (loggedInUser) {
          setUser((prev) => ({ ...prev, loggedInUser, user: data?.user }));
        }
      })();
      navigate(from);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorCode = (error as AuthError).code;
        if (errorCode === 'auth/invalid-email') {
          setError('Invalid login details: Please enter a valid email address.');
        } else if (errorCode === 'auth/wrong-password') {
          setError('Invalid login details: The password you entered is incorrect.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    }

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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={emailRef}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={passwordRef}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to={FORGOT_PASSWORD_PATH} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to={SIGN_UP_PATH} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Copyright />
    </Container>
  );
}
