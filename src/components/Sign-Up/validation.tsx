import { Dispatch, SetStateAction } from 'react';
import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { LoggedInUser } from '../../context/AuthContext.ts';
import { phone } from 'phone';
import { AT, DOT, DUPLICATE_EMAIL, DUPLICATE_PHONE, DUPLICATE_USERNAME, INVALID_EMAIL, INVALID_FIRST_NAME, INVALID_LAST_NAME, INVALID_PASSWORDS_MATCH, INVALID_PASSWORD_LEN, INVALID_PHONE, INVALID_USERNAME_LEN, MAX_FIRST_LAST_NAME_LEN, MAX_USERNAME_LEN, MIN_FIRST_LAST_NAME_LEN, MIN_PASSWORD_LEN, MIN_USERNAME_LEN } from '../../common/common.ts';

const auth = getAuth();

export async function validateSignUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  userName: string,
  phoneNumber: string,
  setError: Dispatch<SetStateAction<string>>,
  allUsers: LoggedInUser[]) {

  setError(null);
  
  if (firstName.length < MIN_FIRST_LAST_NAME_LEN
    || firstName.length > MAX_FIRST_LAST_NAME_LEN
    || !firstName) {
    setError(INVALID_FIRST_NAME);
    return false;
  }

  if (lastName.length < MIN_FIRST_LAST_NAME_LEN
    || lastName.length > MAX_FIRST_LAST_NAME_LEN || !lastName) {
    setError(INVALID_LAST_NAME);
    return false;
  }

  if (password !== confirmPassword || !password) {
    setError(INVALID_PASSWORDS_MATCH);
    return false;
  }

  if (password.length < MIN_PASSWORD_LEN) {
    setError(INVALID_PASSWORD_LEN);
    return false;
  }

  if (!userName || userName.length < MIN_USERNAME_LEN
    || userName.length > MAX_USERNAME_LEN) {
    setError(INVALID_USERNAME_LEN);
    return false;
  }

  const isUniqueUsername = !!allUsers.filter(el => el.username === userName).length;

  if (isUniqueUsername) {
    setError(DUPLICATE_USERNAME);
    return false;
  }

  if (!email.includes(AT) || !email.includes(DOT)) {
    setError(INVALID_EMAIL);
    return false;
  }

  const isUniqueEmail = !!allUsers.filter(el => el.email === email).length;

  if (isUniqueEmail) {
    setError(DUPLICATE_EMAIL);
    return false;
  }

  if (!(phone(phoneNumber)).isValid) {
    setError(INVALID_PHONE);
    return false;
  }

  const isUniquePhone = !!allUsers.filter(el => el.phoneNumber.replace(/ /g, '') === phoneNumber.replace(/ /g, '')).length;

  if (isUniquePhone) {
    setError(DUPLICATE_PHONE);
    return false;
  }

  return true;
}

/**
 * Check if an email is already in use.
 * @param {string} email - The email to check.
 * @returns {boolean} True if the email is already in use, false otherwise.
 */
export const checkEmailExistence = async (email: string) => {

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);

    if (methods.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};
