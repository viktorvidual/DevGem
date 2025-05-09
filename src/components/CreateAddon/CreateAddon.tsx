import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext.ts'
import UploadInput from '../UploadInput/UploadInput.tsx';
import TextInputField from '../TextInputField/TextInputField.tsx';
import SelectCreatable from '../SelectCreatable/SelectCreatable.tsx';
import { Box, Button, FormControl, FormLabel, Input, Link, Stack } from '@mui/joy';
import { getAllTags, updateTags } from '../../services/tag.services.ts';
import { getAllIDEs, updateIDEs } from '../../services/IDE.services.ts';
import { IDEs, SUCCESS_UPLOAD_PATH, TAGS, errorMap } from '../../common/common.ts';
import { isValidCompany, isValidDescription, isValidFile, isValidIDE, isValidName, isValidOriginLink, isValidTag, isValidVersion, isValidVersionInfo } from './createAddonValidations.ts';
import { createAddon, getAllAddons, updateAddonTags } from '../../services/addon.services.ts';
import Error from '../../views/CustomSnackbarError/CustomSnackbarError.tsx';
import Loading from '../../views/Loading/Loading.tsx';
import { useNavigate } from 'react-router-dom';
import DropzoneComponent from '../Dropzone/Dropzone.tsx';
import Typography from '@mui/material/Typography';
import { RequestError } from 'octokit';
import { AddonsContext, AddonsContextType } from '../../context/AddonsContext.ts';
import { Alert, Container, Snackbar, TextField } from '@mui/material';
import { sendEmail } from '../../services/email.services.ts';

import { createStripePrice, createStripeProduct } from '../../services/payment.services.ts';

export default function CreateAddon() {
  const { loggedInUser } = useContext(AuthContext);
  const { setAllAddons } = useContext(AddonsContext);
  const [addonFile, setAddonFile] = useState<File | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [originLink, setOriginLink] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [IDE, setIDE] = useState<string[]>([]);
  const [company, setCompany] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [price, setPrice] = useState<string | number | readonly string[] | undefined>("");
  const [versionInfo, setVersionInfo] = useState<string>('');
  const [submitError, setSubmitError] = useState<Map<string, null | string>>(errorMap);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>("free");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentVerificationCode, setSentVerificationCode] = useState<number | string>('');
  const [codeIsSent, setCodeIsSent] = useState(false)

  const handleIsPaidLinkClick = () => {
    if (type === "free") {
      setType("paid")
    } else {
      setType("free");
      setPrice("");
    }
  };

  const handleSubmit = async () => {

    if (!loggedInUser?.uid) {
      return;
    }

    setIsSubmitted(true);
    if (!Array.from(submitError.values()).every(el => el === null)) {
      return;
    }
    try {
      if (addonFile) {
        setLoading(true);
        const addon = await createAddon(
          name,
          description,
          IDE[0],
          [addonFile],
          images,
          loggedInUser.uid,
          originLink,
          company,
          [logo],
          version,
          versionInfo,
          price);
        navigate(SUCCESS_UPLOAD_PATH);
        if (type === "paid" && price) {
          const productId = await createStripeProduct(name, addon.addonId);
          productId && await createStripePrice(productId, +price, addon.addonId);
        }
        await updateAddonTags(addon.addonId, tags);
        await updateTags(tags);
        await updateIDEs(IDE);
        const result = await getAllAddons();
        setAllAddons && setAllAddons((prev: AddonsContextType) => ({ ...prev, allAddons: result }));
      }
    } catch (error) {
      if (error instanceof RequestError) {
        setUploadError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (uploadError) {
    return <Error error={uploadError} />
  }

  const sendVerificationEmail = async () => {

    if (!loggedInUser) {
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    setSentVerificationCode(code);

    try {
      await sendEmail(`Your verification code is ${code}`, loggedInUser.email, loggedInUser.username);
      setSuccessMessage('Verification code sent to your email.');
    }
    catch (error) {
      console.log(error);
    }finally{
      setCodeIsSent(!codeIsSent)
    }

  };

  const verifyCode = async () => {
    if (verificationCode == sentVerificationCode) {
      setIsCodeVerified(true);
      setSuccessMessage('Verification successful! You can now upload your addon.');
    } else {
      setSuccessMessage('Invalid verification code. Please try again.');
    }
  };


  /**
   * Handle change event for the Tags component.
   * @param {Array} e - The selected tags.
   */
  const handleTagsChange = (e: string[]) => {
    setTags(e);
  };

  /** 
   * Handle change event for the IDEs component.
   * @param {Array} e - The selected IDE.
   */
  const handleIDEChange = (values: string[]) => {
    setIDE(values);
  };

  return (
    <Stack spacing={4}
      sx={{
        maxWidth: '60%',
        borderRadius: 'sm',
        marginRight: 'auto',
        marginLeft: 'auto',
      }}>
        <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSuccessMessage("")}>
        <Alert severity={successMessage.includes("Invalid") ? "error" : "success"}>{successMessage}</Alert>
      </Snackbar>
      

      {!isCodeVerified && !codeIsSent &&
  
        <Container>
        <Box sx={{mt:'20%', mb:'30%'}}>
          <Typography variant='h4' sx={{ pt: 3, fontWeight: "bold", mb:2 }}>Upload new addon</Typography>
          <Typography>Please click the button below and we are going to send you a verificaiton code to your email. Please verify the code and the upload form is going to appear on the page.</Typography>
          <Button onClick={sendVerificationEmail} sx={{mt:2}}>Send Code</Button>
          <br />
          </Box>
          </Container>
      }

      { !isCodeVerified && codeIsSent &&

        <Container>
        <Box sx={{mt:'20%', mb:'30%'}}>
        <Typography variant='h4' sx={{ pt: 3, fontWeight: "bold", mb:2 }}>Upload new addon</Typography>
        <Typography variant='h5' sx={{mb:2}}>Please enter the code below</Typography>
        <TextField
          label="Verification Code"
          type="number"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <br/>
        <Button onClick={verifyCode} sx={{ m: 1 }}>
          Verify Code
        </Button>
        </Box>
        </Container>
      }

      {isCodeVerified &&
        <>

          <UploadInput
            setValue={setAddonFile}
            setSubmitError={setSubmitError}
            isSubmitted={isSubmitted}
            validateValue={isValidFile}
            isRequired={true}
            acceptedFormats='.jar, .zip'
            inputLabel='Plugin file' />

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flexGrow: 1 }}>

              <FormControl>
                <TextInputField setValue={setVersion}
                  inputType="text"
                  inputPlaceholder="Enter version #"
                  inputLabel="Version"
                  setSubmitError={setSubmitError}
                  isSubmitted={isSubmitted}
                  validateValue={isValidVersion}
                  initialValue={version} />
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <FormControl>
                <TextInputField setValue={setVersionInfo}
                  inputType="text"
                  inputPlaceholder="Enter version info"
                  inputLabel="Version info"
                  setSubmitError={setSubmitError}
                  isSubmitted={isSubmitted}
                  validateValue={isValidVersionInfo}
                  initialValue={versionInfo}
                  isRequired={false} />
              </FormControl>
            </Box>

          </Box>

          <TextInputField setValue={setName}
            inputType="text"
            inputPlaceholder="Enter unique name"
            inputLabel="Name"
            setSubmitError={setSubmitError}
            isSubmitted={isSubmitted}
            validateValue={isValidName} />

          <TextInputField setValue={setOriginLink}
            inputType="text"
            inputPlaceholder="https://"
            inputLabel="Source code URL"
            isSubmitted={isSubmitted}
            validateValue={isValidOriginLink}
            setSubmitError={setSubmitError} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flexGrow: 1 }}>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <SelectCreatable
                  changeValues={handleTagsChange}
                  getAllValues={getAllTags}
                  type={TAGS}
                  setSubmitError={setSubmitError}
                  isSubmitted={isSubmitted}
                  validateValue={isValidTag} />
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <FormControl>
                <FormLabel>Target IDE</FormLabel>
                <SelectCreatable
                  changeValues={handleIDEChange}
                  getAllValues={getAllIDEs}
                  type={IDEs}
                  setSubmitError={setSubmitError}
                  isSubmitted={isSubmitted}
                  validateValue={isValidIDE} />
              </FormControl>
            </Box>

          </Box>
          <TextInputField setValue={setDescription}
            inputType="text"
            inputPlaceholder="Add details"
            inputLabel="Description"
            isSubmitted={isSubmitted}
            validateValue={isValidDescription}
            setSubmitError={setSubmitError} />

          <FormControl sx={{ alignItems: 'center' }}>
            <DropzoneComponent
              setFiles={setImages}
              validateValue={isValidFile} />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <UploadInput
                setValue={setLogo}
                setSubmitError={setSubmitError}
                isSubmitted={isSubmitted}
                validateValue={isValidFile}
                isRequired={false}
                acceptedFormats='.jpg, .png, .svg'
                inputLabel='Logo' />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <TextInputField setValue={setCompany}
                inputType="text"
                inputPlaceholder="Enter name"
                inputLabel="Company"
                isSubmitted={isSubmitted}
                validateValue={isValidCompany}
                setSubmitError={setSubmitError} />
            </Box>
          </Box>

            <FormControl>
              <FormLabel>
                <Link
                  onClick={handleIsPaidLinkClick}
                  fontSize="sm">This is a paid add-on
                </Link>
              </FormLabel>
              {type === "paid" && <Input
                type='number'
                sx={{ minHeight: '3em' }}
                name="currency-input"
                placeholder="Amount"
                onChange={(e) => setPrice(e.target.value)}
                startDecorator={{ dollar: '$' }['dollar']}
                value={price} />}
            </FormControl>

          <Button
            type="submit"
            className="mt-3"
            onClick={handleSubmit}
            style={{ backgroundColor: '#1b74e4' }}
          >
            Upload addon
          </Button>
        </>}
    </Stack>
  )
}