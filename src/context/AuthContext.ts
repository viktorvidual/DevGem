import { User } from "firebase/auth";
import {  Dispatch, SetStateAction, createContext } from "react";
import { AppState } from "../components/Auth-Context-Provider/AuthContextProvider.tsx";

export interface LoggedInUser {
  uid: string;
  createdOn: Date;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureURL?: string;
  role?: string;
  username: string;
  blockedStatus?: boolean;
  identityDocumentId?: string;
  phoneNumber: string;
  reports?: string[];
  following?: string[];
}
export interface AuthContextType {
  user: User | undefined | null;
  loggedInUser: LoggedInUser | null;
  allUsers?: LoggedInUser[];
  setUser: Dispatch<SetStateAction<AppState>>;
}

/**
 * The AuthContext provides a context for managing user authentication and user data.
 *
 * This context includes information about the logged-in user, all users, and a function
 * to set the user data.
 *
 * @type {object}
 * @property {object} user - The currently logged-in user object.
 * @property {object} loggedInUser - The detailed information about the logged-in user.
 * @property {object} allUsers - A collection of all users in the application.
 * @property {function} setUser - A function to set the user data in the context.
 *
 * @see {@link https://reactjs.org/docs/context.html | React Context}
 *
 * @example
 * import { createContext, useContext } from "react";
 *
 * const AuthContext = createContext({
 *   user: undefined,
 *   loggedInUser: {},
 *   allUsers: {},
 *   setUser: () => {},
 * });
 *
 * export default AuthContext;
 *
 * // In a component, you can use the AuthContext like this:
 * const { user, loggedInUser, allUsers, setUser } = useContext(AuthContext);
 */
export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loggedInUser: {} as LoggedInUser,
  allUsers: [],
  setUser: (): void => {},
});
