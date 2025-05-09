import {  Dispatch, SetStateAction, createContext } from "react";

export interface Addon {
  name: string;
  rating: number;
  targetIDE: string;
  userUid: string;
  description: string;
  tags: string[];
  downloadLink: string;
  originLink: string;
  featured?: boolean;
  downloadsCount?: number;
  uploadDate: Date;
  draftCreateDate?: Date;
  addonId: string;
  status: string;
  ownerUid: string;
  contributors?: string[];
  company?: string;
  images?: string[];
  logo?: string;
  versions: string[];
  createdOn: number;
  downloads: number;
  isFree: boolean;
  price?: number | null;
  hasReview?: Reviews;
}

export interface Reviews {
  [key: string]: boolean;
}
export interface Contributors {
    [key: string]: string;
}

export interface AddonsContextType {
  allAddons: Addon[];
  setAllAddons?: Dispatch<SetStateAction<AddonsContextType>>;
}

/**
 * The AddonsContext provides a context for managing post data.
 *
 * This context includes an array of all addons and a function to set the addons data.
 *
 * @type {AddonsContextType}
 * @property {Array} allAddons - An array containing all the post data.
 * @property {function} setAllAddons - A function to set the post data in the context.
 *
 * @see {@link https://reactjs.org/docs/context.html | React Context}
 *
 * @example
 * import { createContext, useContext } from "react";
 *
 * const AddonsContext = createContext({
 *   allAddons: [],
 *   setAllAddons: () => [],
 * });
 *
 * export default AddonsContext;
 *
 * // In a component, you can use the AddonsContext like this:
 * const { allAddons, setAllAddons } = useContext(AddonsContext);
 */
export const AddonsContext = createContext<AddonsContextType>({
  allAddons: [],
  setAllAddons: () => [],
});
