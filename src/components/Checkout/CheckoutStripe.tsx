import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router';
import { completeSubscriptionCreateSteps } from './checkout.helpers.tsx';
import { AuthContext } from '../../context/AuthContext.ts';
import { UserData } from './Checkout.tsx';
import Loading from '../../views/Loading/Loading.tsx';
import { StripeError } from '@stripe/stripe-js';
import CustomSnackbarError from '../../views/CustomSnackbarError/CustomSnackbarError.tsx';

interface Props {
  userData: UserData;
  isSubmitted: boolean | string;
}

function CheckoutStripe({ userData, isSubmitted }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();
  const addonId: string | undefined = params.addon;
  const { loggedInUser } = useContext(AuthContext);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const currentUrl = location.pathname + location.search + location.hash;
  const domain = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (error: StripeError | unknown) => {
    if (error instanceof Error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    if (isSubmitted && submitButtonRef.current) {
      submitButtonRef.current.click();
      setLoading(true);
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !loggedInUser) {
      return;
    }

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        handleError(submitError);
        return;
      }

      const result = addonId && await completeSubscriptionCreateSteps(
        loggedInUser.email,
        addonId,
        loggedInUser.uid,
        userData,
        addonId);

      if (!(result && typeof result === "object")) {
        return;
      }

      const { type, clientSecret } = result;

      const confirmIntent = type === "setup" ? stripe.confirmSetup : stripe.confirmPayment;

      if (clientSecret) {
        const { error } = await confirmIntent({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${domain}${currentUrl}/complete`,
          },
        });

        if (error) {
          handleError(error);
        }
      }

    } catch (error: unknown) {
      handleError(error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" ref={submitButtonRef} style={{ display: 'none' }} />
      {loading && <Loading />}
      {errorMessage && <CustomSnackbarError error={errorMessage} />}
    </form>
  )
}

export default CheckoutStripe