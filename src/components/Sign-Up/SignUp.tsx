import { FormEvent, useContext, useState } from "react";
import { AuthContext, LoggedInUser } from "../../context/AuthContext";
import { registerUser } from "../../services/auth.services";
import { HOME_PATH, URL_TO_EXTERNAL_DEFAULT_PROF_PIC } from "../../common/common";
import { Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { LOG_IN_PATH } from "../../common/common";
import Copyright from "../../common/copyright";

import { validateSignUp } from "./validation";
import {
  createUserByUsername,
  getAllUsers,
  getUserData
}
  from "../../services/user.services";

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
import { sendEmailVerification } from "firebase/auth";
import { Snackbar } from "@mui/material";

export default function RegistrationForm() {
  const { allUsers } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfrimPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const profilePictureURL = URL_TO_EXTERNAL_DEFAULT_PROF_PIC;

  // const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  /**
   * Handle registration form submission.
   * @param {Event} event - The form submit event.
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const isValidUser = await validateSignUp(firstName, lastName, email, password, confirmPassword, userName, phoneNumber, setError, allUsers);

    if (!isValidUser) {
      return;
    }

    try {

      const credential = await registerUser(email, password);
      await sendEmailVerification(credential.user);

      credential.user.email && await createUserByUsername(
        firstName,
        lastName,
        credential.user.uid,
        credential.user.email,
        userName,
        company,
        profilePictureURL,
        phoneNumber
      );
      const loggedUserSnapshot = await getUserData(credential.user.uid);
      const loggedInUser = (Object.values(loggedUserSnapshot.val()).find(
        (el) => (el as LoggedInUser).uid === credential.user.uid
      )) as LoggedInUser;
      const allUsers = await getAllUsers();
      
      if (loggedInUser) {
        setUser({
          user: credential.user,
          loggedInUser,
          allUsers,
        });
      }

      setSuccessMessage('Registration is complete. Please check your inbox for email confirmation.');

    } catch (error) {

      console.error(error);
    } finally {
      setTimeout(() => {
        navigate(HOME_PATH);
      }, 5000)
    }
  };

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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="Username"
                label="Username"
                name="Username"
                autoComplete="Username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="Company Name"
                label="Company Name"
                name="Company Name"
                autoComplete="Company Name"
                onChange={(e) => setCompany(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="Phone Number"
                label="Phone Number"
                name="Phone Number"
                autoComplete="Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Confirm Password"
                label="Confirm Password"
                type="password"
                id="Confirm Password"
                autoComplete="Confirm Password"
                onChange={(e) => setConfrimPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to={LOG_IN_PATH} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

        <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Copyright />
    </Container>

  );

}