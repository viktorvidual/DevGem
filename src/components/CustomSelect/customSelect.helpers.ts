import { LoggedInUser } from "../../context/AuthContext.ts";
import { OptionCustom } from "../SelectCreatable/selectCreatableHelpers.ts";

export function convertToOptionsFormat(arr: LoggedInUser[]): OptionCustom[] {
  return arr.map(el => ({
    value: el.firstName + " " + el.lastName,
    details: el.username,
    image: el.profilePictureURL,
    label: el.username,
    id: el.uid
  }))
}