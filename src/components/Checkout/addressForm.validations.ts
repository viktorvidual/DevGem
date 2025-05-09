import { Dispatch, SetStateAction } from 'react';
import { INVALID_ADDRESS, INVALID_CITY, INVALID_COUNTRY, INVALID_FIRST_NAME, INVALID_LAST_NAME, INVALID_ZIP, MAX_FIRST_LAST_NAME_LEN, MIN_ADDRESS_LEN, MIN_CITY_LEN, MIN_COUNTRY_LEN, MIN_FIRST_LAST_NAME_LEN } from '../../common/common.ts';

export function validateAddressForm(
  firstName: string,
  lastName: string,
  address: string,
  city: string,
  zip: string,
  country: string,
  setError: Dispatch<SetStateAction<string | null>>) {

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

  if (country.length < MIN_COUNTRY_LEN || !country) {
    setError(INVALID_COUNTRY);
    return false;
  }

  if (address.length < MIN_ADDRESS_LEN || !address) {
    setError(INVALID_ADDRESS);
    return false;
  }

  if (city.length < MIN_CITY_LEN || !city) {
    setError(INVALID_CITY);
    return false;
  }

  if (!Number.isInteger(+zip) || !zip) {
    setError(INVALID_ZIP);
    return false;
  }

  return true;
}