import { useContext, useState } from "react";
import {
  Button,
  Card,
  TextField,
  Typography,
  Snackbar,
  CardContent,
  CardHeader
} from "@mui/material";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { getAllUsers, updateProfileEmail } from "../../services/user.services";
import { sendEmailVerification } from "firebase/auth";

export default function EmailSection() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const { loggedInUser, user, setUser } = useContext<AuthContextType>(AuthContext);


  const handleSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  const changeEmail = async () => {
    const password = prompt(
      "Please enter your password to confirm email change:"
    );
    if (password && loggedInUser) {
      const credentials = EmailAuthProvider.credential(
        loggedInUser.email,
        password
      );
      try {
        user && await reauthenticateWithCredential(user, credentials);

        if (email && user) {
          await updateEmail(user, email);
          setErrorSnackbarOpen(true);
          const allUsers = await getAllUsers();
          setUser((prev) => ({ ...prev, allUsers }));
          await updateProfileEmail(email, loggedInUser.username);
          await sendEmailVerification(user);
          setEmail("");
          setEmailError("");
        }
      } catch (error) {
        setEmailError("Invalid email or password! Please try again.");
      }
    }
  };

  return (
    <div>
      <Card sx={{ border: "1px solid #DFDFE0" }}>
        <CardHeader title="Update your email:" 
        titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }} />
        <CardContent>
          <form>
            <TextField
              fullWidth
              id="confirmEmail"
              label="Change Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New email"
              margin="normal"
              variant="outlined"
            />
            {emailError && (
              <Typography color="error" variant="body2">
                {emailError}
              </Typography>
            )}
            <Button
              onClick={changeEmail}
              variant="contained"
            >
              Update Email
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Congratulations! You successfully changed your email!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
