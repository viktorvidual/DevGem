import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Container, Grid, Divider } from "@mui/material";
import EmailSection from "./EmailField";
import PasswordSection from "./PasswordField";
import PhoneSection from "./PhoneField";
import ProfilePictureSection from "./ProfilePicture";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { ACCOUNT_SETTINGS, HOME_PATH, ADMIN } from "../../common/common";
import DeleteAccountSection from "./DeleteAccount";
import { ArrowBackRounded } from "@mui/icons-material";

const AccountSettings = () => {
  const { loggedInUser, user } = useContext<AuthContextType>(AuthContext);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {

    if (user && loggedInUser) {
      loggedInUser.role && setUserRole(loggedInUser.role);
    }

  }, [loggedInUser]);

  return (
    <Container maxWidth="md">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" style={{ marginTop: "20px", flexGrow: 1, fontWeight: "bold", textAlign: "left" }}>
          {ACCOUNT_SETTINGS}
        </Typography>
        <Link to={HOME_PATH} style={{
          display: "block",
          fontSize: "small",
          color: "#1b74e4",
          fontWeight: "400",
          textDecoration: "none",
          marginRight: "15px"
        }}>
          <ArrowBackRounded /> <br />
          Back To Home
        </Link>
      </div>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProfilePictureSection />
        </Grid>
        <Grid item xs={12}>
          <PasswordSection />
        </Grid>
        <Grid item xs={12}>
          <EmailSection />
        </Grid>
        {userRole === ADMIN && (
          <Grid item xs={12}>
            <PhoneSection />
          </Grid>
        )}
        <Grid item xs={12}>
          <DeleteAccountSection />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountSettings;
