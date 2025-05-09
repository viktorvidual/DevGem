import { Fragment, useState, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { OrderSteps } from '../../common/common.ts';
import { getStepContent } from './checkout.helpers.tsx';
import { validateAddressForm } from './addressForm.validations.ts';
import { Alert } from '@mui/material';
import { useParams } from 'react-router';
import { AddonsContext } from '../../context/AddonsContext.ts';

const steps = [OrderSteps.review, OrderSteps.shipping, OrderSteps.payment];
export interface UserData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  region: string;
  zip: number | string;
  country: string;
}

export default function Checkout() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const {allAddons} = useContext(AddonsContext);
  const [error, setError] = useState<string | null>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState<string | boolean>("");
  const params = useParams();
  const addonId = params.addon;
  const status = params.status;

  const handleNext = () => {
    if (activeStep + 1 === steps.length) {
      setIsPaymentSubmitted(crypto.randomUUID());
      return;
    }

    if (!error) {
      setActiveStep(activeStep + 1);
    }

  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError('');
  };

  return (
    <Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          {!status && (
            <div>
              <Typography component="h1" variant="h4" align="center">
                Checkout
              </Typography>
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          )}
          {status === "complete" ? (
            <Fragment>
              <Typography variant="h5" gutterBottom marginTop="1em">
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                We have emailed your order 
                confirmation and invoice. Check you email for more details.
                Your subscription is now active and you can manage it in your account.
                <br/>
                <br/>
                <Button href={allAddons.find(addon => addon.addonId === addonId)?.downloadLink}>Download your addon</Button>
              </Typography>
            </Fragment>
          ) : (
            <Fragment>
              {getStepContent(activeStep, validateAddressForm, setError, setUserData, userData, isPaymentSubmitted)}
              {showError && error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                  onClickCapture={() => setShowError(!!error)}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </Fragment>
          )}
        </Paper>
      </Container>
    </Fragment>
  );
}