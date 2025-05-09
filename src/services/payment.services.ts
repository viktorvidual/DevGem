import { PaymentIntent, SetupIntent } from "@stripe/stripe-js";
import { stripe } from "../config/stripe.ts"

export const createStripeProduct = async (name: string, addonId: string) => {
  try {
    const product = await stripe.products.create({
      name,
      metadata: {
        'addon_id': addonId,
      },
    });
    return product.id

  } catch (error) {
    console.log(error);
  }
}

export const createStripePrice = async (productId: string, unitPrice: number, addonId: string) => {
  try {
    await stripe.prices.create({
      unit_amount: unitPrice * 100,
      currency: 'usd',
      recurring: { interval: 'year' },
      product: productId,
      metadata: {
        'addon_id': addonId,
      }
    })
  } catch (error) {
    console.log(error);
  }
}

export const createStripeCustomer = async (
  email: string,
  uid: string,
  name: string,
  country: string,
  city: string,
  line1: string,
  zip: string | number,
  state?: string) => {
  try {
    const customer = await stripe.customers.create({
      name,
      email,
      address: {
        city,
        country,
        line1,
        postal_code: zip.toString(),
        state,
      },
      metadata: {
        'user_uid': uid,
      },
    });

    return customer.id;
  } catch (error) {
    console.log(error);
  }
}

export const getStripeCustomerByEmail = async (email: string) => {
  try {
    const customer = await stripe.customers.search({
      query: `email:'${email}'`,
    });
    return customer.data[0]?.id;
  } catch (error) {
    console.log(error);
  }
}

export const getStripePriceByProductId = async (productId: string) => {
  try {
    const price = await stripe.prices.search({
      query: `metadata["addon_id"]:"${productId}"`,
    })

    return price.data[0].id;
  } catch (error) {
    console.log(error);
  }
}

export const getStripeProductByAddonId = async (addonId: string) => {
  try {
    const product = await stripe.products.search({
      query: `metadata["addon_id"]:"${addonId}"`,
    });

    return product.data[0].id;

  } catch (error) {
    console.log(error);
  }
}

export const getStripeSubscriptionsByUser = async (uid: string) => {
  const subscriptions = await stripe.subscriptions.search({
    query: `metadata["user_uid"]:"${uid}"`,
  });
  return subscriptions.data;
}

export const getStripeInvoiceLinkById = async (id: string) => {
  const invoice = await stripe.invoices.retrieve(id);
  return invoice;
}

export const createStripeSubscription = async (customerId: string, priceId: string, uid: string, addonName: string) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        { price: priceId },
      ],
      metadata: {
        'user_uid': uid,
        'addon_name': addonName,
      },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
    });

    if (subscription.pending_setup_intent !== null) {
      return ({
        type: 'setup',
        clientSecret: (subscription.pending_setup_intent as SetupIntent).client_secret,
      });
    } else if (typeof subscription.latest_invoice !== "string") {
      return ({
        type: 'payment',
        clientSecret: ((subscription.latest_invoice)?.payment_intent as PaymentIntent).client_secret,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const updateStripePrice = async (priceId: string, newAmount: number, productId: string, addonId: string) => {
  try {
    await stripe.prices.update(priceId, {
      active: false,
    });

    const newPrice = await createStripePrice(productId, newAmount, addonId);
    return newPrice;
  } catch (error) {
    console.log(error);
  }
}

export const cancelStripeSubscription = async (subscriptionId: string) => {
  const cancelled = await stripe.subscriptions.cancel(subscriptionId);
  return cancelled.status;
}
