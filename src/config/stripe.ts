import Stripe from "stripe"
import { API_KEY_STRIPE_SECRET } from "../common/common.ts"

export const stripe = new Stripe(API_KEY_STRIPE_SECRET, {
  apiVersion: '2023-08-16',
});