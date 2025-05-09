import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.ts";
import { getStripeInvoiceLinkById, getStripeSubscriptionsByUser } from "../../services/payment.services.ts";
import Stripe from "stripe";

export const useAccountSubscriptions = (
  setSubscriptions: Dispatch<SetStateAction<Stripe.Subscription[]>>,
  hasCancellation: boolean,
  setCurrentInvoice: Dispatch<SetStateAction<{ [key: string]: string }>>) => {

  const { loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    (async () => {
      const result = await getStripeSubscriptionsByUser(loggedInUser.uid);
      setSubscriptions(result);
      result.forEach(subscription => typeof subscription.latest_invoice === "string" && getInvoice(subscription.latest_invoice, setCurrentInvoice));
    })();
  }, [loggedInUser, hasCancellation, setSubscriptions, setCurrentInvoice]);
}

export const getInvoice = async (id: string, setCurrentInvoice: Dispatch<SetStateAction<{ [key: string]: string }>>) => {
  const invoice = await getStripeInvoiceLinkById(id);
  setCurrentInvoice(prevState => ({ ...prevState, [id]: invoice.hosted_invoice_url || "#" }));
}