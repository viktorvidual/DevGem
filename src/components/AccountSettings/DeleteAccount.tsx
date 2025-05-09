import { getReviewsByUserUidHandle } from "../../services/review.services";
import { useContext } from "react";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { AddonsContext } from "../../context/AddonsContext";
import { Button, Card, CardContent, Typography, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import { deleteUserData } from "../../services/user.services";
import { logoutUser } from "../../services/auth.services";

/**
 * Component that provides the functionality to delete the user's account,
 * along with associated posts, comments, and voting data.
 *
 * @return {<DeleteAccountSection />};
 */
export default function DeleteAccountSection() {

  const { loggedInUser, user } = useContext<AuthContextType>(AuthContext);
  const { allAddons } = useContext(AddonsContext);

  async function handleDelete() {
    const password = prompt(
      "Please enter your password to confirm account deletion:"
    );
    if (password && loggedInUser) {
      const credentials = EmailAuthProvider.credential(
        loggedInUser.email,
        password
      );

      try {

        user && await reauthenticateWithCredential(user, credentials);

        if (
          window.confirm(
            "Are you sure you want to delete your account? This action is irreversible. Your account, posts, comments and other activity will be deleted."
          )
        ) {
          try {
            const addonsToBeDeleted = allAddons.filter((addon) => {
              addon.userUid === loggedInUser.uid;
            })

            const reviewsToBeDeleted = await (getReviewsByUserUidHandle(loggedInUser.uid))

            user && await deleteUser(user);

            await deleteUserData(
              loggedInUser.username,
              addonsToBeDeleted,
              reviewsToBeDeleted
            )
            alert("Your account has been deleted.");
            logoutUser();


          } catch (error) {
            console.log(error);
          }

        }
      } catch (error) {
        console.log(error);

      }

    }
  }

  return (
    <>
      <Card sx={{ border: "1px solid #DFDFE0" }}>
        <CardHeader title="Want to delete your account?"
          titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }} />
        <CardContent>
          <Typography>
            Click the Button and delete your account:
          </Typography>
          <Box display="flex" justifyContent="center" marginTop="15px">
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
            >
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )

}