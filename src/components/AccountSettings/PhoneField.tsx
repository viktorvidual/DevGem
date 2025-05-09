import { useContext, useState } from "react";
import {
  Button,
  Card,
  TextField,
  Snackbar,
  CardContent,
  CardHeader
} from "@mui/material";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { updateProfilePhone } from "../../services/user.services";
import { getAllUsers } from "../../services/user.services";

export default function PhoneSection() {
  const [phone, setPhone] = useState("");
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const { loggedInUser, user, setUser } = useContext<AuthContextType>(AuthContext);

  const handleSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  const changePhone = async () => {
    const password = prompt(
      "Please enter your password to confirm phone change:"
    );
    if (password && loggedInUser) {
      const credentials = EmailAuthProvider.credential(
        loggedInUser.email,
        password
      );
      try {
        user && await reauthenticateWithCredential(user, credentials);
        if (phone) {
          await updateProfilePhone(phone, loggedInUser.username);
          setErrorSnackbarOpen(true);
          const allUsers = await getAllUsers();
          setUser((prev) => ({ ...prev, allUsers }));
          setPhone(phone);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Card sx={{ border: "1px solid #DFDFE0" }}>
        <CardHeader title="Want to change your phone number?"
          titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }} />
        <CardContent>
          <form>
            <TextField
              fullWidth
              id="confirmPhone"
              label="Change Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="New phone"
              margin="normal"
              variant="outlined"
            />
            <Button
              onClick={changePhone}
              variant="contained"
              style={{
                margin: "0 auto",
                display: "block",
                marginTop: "15px",
                fontSize: "17px",
              }}
            >
              Update Phone
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Congratulations! You successfully changed your phone!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
