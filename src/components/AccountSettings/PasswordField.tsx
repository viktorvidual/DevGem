import { useContext, useState } from "react";
import { Button, Card, TextField, Typography, Snackbar, CardContent, CardHeader } from "@mui/material";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { updatePassword } from "firebase/auth";

export default function PasswordSection() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const { loggedInUser, user } = useContext<AuthContextType>(AuthContext);

  const handleSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  const changePassword = async () => {
    try {
      if (loggedInUser && user && user.metadata.lastSignInTime) {
        const lastSignInTime = new Date(user.metadata.lastSignInTime);
        const currentTime = new Date();

        const timeDifferenceInMinutes =
          (currentTime - lastSignInTime) / (1000 * 60);
        const acceptableTimeDifference = 5;

        if (timeDifferenceInMinutes <= acceptableTimeDifference) {
          if (password && confirmPassword) {
            if (password === confirmPassword) {
              user && await updatePassword(user, password);
              setPassword("");
              setConfirmPassword("");
              setErrorSnackbarOpen(true);
              setPasswordError("");
            } else {
              setPasswordError("Please check if the two passwords match!");
            }
          } else {
            setPasswordError("Please enter your password in both fields!");
          }
        } else {
          setPasswordError(
            "For security reasons, please sign in again before changing your password."
          );
        }
      }
    } catch (error) {
      setPasswordError(
        "An error occurred while changing the password. Please try again."
      );
      console.error(error);
    }
  };

  return (
    <>
      <Card sx={{ border: "1px solid #DFDFE0" }}>
        <CardHeader title="Change your password:" titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }} />
        <CardContent>
          <form>
            <TextField
              fullWidth
              id="password"
              label="Change Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              margin="normal"
              variant="outlined"
            />
            {passwordError && (
              <Typography color="error" variant="body2">
                {passwordError}
              </Typography>
            )}
            <TextField
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              margin="normal"
              variant="outlined"
            />
            <Button
              onClick={changePassword}
              variant="contained"
              style={{ margin: "0 auto", display: "block", marginTop: "15px" }}
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Congratulations! You successfully changed your password!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
