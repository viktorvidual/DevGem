import { useContext, useEffect, useState } from "react";
import {
  Button,
  Typography,
  FormControl,
  Card,
  Snackbar,
  CardContent,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { updateProfilePic } from "../../services/user.services";
import Skeleton from '@mui/joy/Skeleton';
import {
  AVATAR_API_URL,
  DEFAULT_PROF_PIC_DIR,
} from "../../common/common";
import { FileWithPath } from "react-dropzone";
import UploadInput from "../UploadInput/UploadInput.tsx";
import { isValidFile } from "../CreateAddon/createAddonValidations.ts";

export default function ProfilePictureSection() {
  const [photo, setPhoto] = useState<FileWithPath | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePictureURL, setProfilePictureURL] = useState<string>("");
  const [prevProfilePictureURL, setPrevProfilePictureURL] = useState<string>(
    profilePictureURL
  );
  const [isRandomAvatarDisabled, setIsRandomAvatarDisabled] =
    useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const { loggedInUser, user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setLoading(true);
    }
    if (user && loggedInUser) {
      setFirstName(loggedInUser.firstName);
      setSurname(loggedInUser.lastName);
      setProfilePictureURL(
        loggedInUser.profilePictureURL || DEFAULT_PROF_PIC_DIR
      );
      setPrevProfilePictureURL(
        loggedInUser.profilePictureURL || DEFAULT_PROF_PIC_DIR
      );
      setUsername(loggedInUser.username);
    }
    setLoading(false);
  }, [loggedInUser]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleClickRandomAvatar = async () => {
    try {
      const imageResponse = await fetch(`${AVATAR_API_URL}${crypto.randomUUID()}`);
      const imageUrl = imageResponse.url;
      const file = await createFileFromUrl(imageUrl);
      setProfilePictureURL(imageUrl);
      setPhoto(file);
      setIsRandomAvatarDisabled(true);
    } catch (error) {
      console.error(error);
    }
  };

const createFileFromUrl = async (url: string): Promise<File> => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const metadata = { type: "image/jpg" };
      const file = new File([data], `${crypto.randomUUID()}.jpg`, metadata);
      return file;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const handleClickUpload = async () => {
    if (photo && loggedInUser) {
      try {
        const data = await updateProfilePic(photo, loggedInUser.username);
        setProfilePictureURL(data);
        setPrevProfilePictureURL(data);
        setSnackbarOpen(true);

      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <>
      {loading || !user ? (
        <Skeleton height={100} width={300} />
      ) : (
        <Card sx={{ border: "1px solid #DFDFE0" }}>
          <CardContent>
            <div style={{ display: "flex", alignItems: "center" }}>
              {profilePictureURL && (
                <img
                  src={profilePictureURL}
                  alt="Profile picture"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", marginLeft: "1em" }}>
                <Typography
                  variant="h6"
                  textAlign="left"

                >
                  {firstName} {surname}
                </Typography>
                <Typography
                  variant="h6"
                  color="#1b74e4"
                  textAlign="left"

                >
                  @{username}
                </Typography>
                <div className="d-flex">
                  {!isRandomAvatarDisabled ? (
                    <Button
                      variant='outlined'
                      onClick={handleClickRandomAvatar}
                      sx={{ mt: 1 }}
                    >
                      Generate random avatar

                    </Button>
                  ) : (
                    <Button onClick={handleClickUpload}>
                      Upload
                    </Button>
                  )}
                  {isRandomAvatarDisabled && (
                    <Button
                      onClick={() => {
                        setIsRandomAvatarDisabled(false);
                        setProfilePictureURL(prevProfilePictureURL);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <br />
      <Card sx={{ border: "1px solid #DFDFE0" }}>
        <CardContent>
          <Typography
            paragraph
            align='left'
            fontWeight="bold"
          >
            Or you can upload another profile picture (png, jpg/jpeg, GIF):
          </Typography>
          <br />
          <FormControl fullWidth>
            <UploadInput
              setValue={setPhoto}
              validateValue={isValidFile}
              isRequired={false}
              acceptedFormats='.jpg, .png, .svg'
              inputLabel="Image" />

          </FormControl>
          <Button
            onClick={handleClickUpload}
            disabled={loading || !photo}
            variant='contained'
            sx={{ mt: 3 }}
          >
            Upload
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message="You have successfully changed your profile picture!"
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        </CardContent>
      </Card>
    </>
  );
}
