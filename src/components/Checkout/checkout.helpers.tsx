import { Dispatch, SetStateAction } from "react";
import AddressForm from "./AddressForm.tsx";
import OrderReview from "./OrderReview.tsx";
import PaymentForm from "./PaymentForm.tsx";
import { API_KEY_STRIPE_PUBLISHABLE } from "../../common/common.ts";
import { loadStripe } from "@stripe/stripe-js";
import { createStripeCustomer, createStripeSubscription, getStripeCustomerByEmail, getStripePriceByProductId } from "../../services/payment.services.ts";
import { UserData } from "./Checkout.tsx";
import { getAddonById } from "../../services/addon.services.ts";

export function getStepContent(step: number,
  validateCheckout: (firstName: string,
    lastName: string,
    address: string,
    city: string,
    zip: string,
    country: string,
    setError: Dispatch<SetStateAction<string | null>>) => void,
  setError: Dispatch<SetStateAction<string | null>>,
  setUserData: Dispatch<SetStateAction<UserData>>,
  userData: UserData,
  isPaymentSubmitted: boolean | string) {
  switch (step) {
    case 0:
      return <OrderReview />;
    case 1:
      return <AddressForm validateFn={validateCheckout} setError={setError} setUserData={setUserData} />;
    case 2:
      return <PaymentForm userData={userData} isSubmitted={isPaymentSubmitted} />;
    default:
      throw new Error('Unknown step');
  }
}

export const stripePromise = loadStripe(API_KEY_STRIPE_PUBLISHABLE);

export const completeSubscriptionCreateSteps = async (
  email: string,
  productId: string,
  uid: string,
  userData: UserData,
  addonId: string) => {

  try {
    let currentCustomer = await getStripeCustomerByEmail(email);
    if (!currentCustomer) {
      currentCustomer = await createStripeCustomer(email, uid, userData.firstName + userData.lastName, userData.country, userData.city, userData.address, userData.zip);
    }
    const priceId = await getStripePriceByProductId(productId);

    const addon = await getAddonById(addonId);

    const result = currentCustomer && priceId && await createStripeSubscription(currentCustomer, priceId, uid, addon.name);

    return result;

  } catch (error) {
    console.log(error);
  }
}