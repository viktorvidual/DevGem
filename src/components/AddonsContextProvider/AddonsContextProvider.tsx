import { ReactNode, useContext, useEffect, useState } from "react";
import { Addon, AddonsContext, AddonsContextType } from "../../context/AddonsContext.ts";
import { getAllAddons } from "../../services/addon.services.ts";
import { onValue, ref } from "@firebase/database";
import { database } from "../../config/firebase.ts";
import CustomSnackbarError from "../../views/CustomSnackbarError/CustomSnackbarError.tsx";
export interface AddonsContextProviderProps {
  children: ReactNode;
}
/**
 * The AddonsContextProvider component.
 *
 * @param {AddonsContextProviderProps} props - The properties.
 * @returns {JSX.Element} The rendered JSX element.
 */
export default function AddonsContextProvider({ children }: AddonsContextProviderProps): JSX.Element {
  const { allAddons, setAllAddons } = useContext(AddonsContext);
  const [appAddonsState, setAppAddonsState] = useState<AddonsContextType>({ allAddons, setAllAddons });
  const [error, setError] = useState<null | Error>(null);

  /**
   * Use effect hook to fetch all addons and listen for changes in the addons.
   */
  useEffect(() => {
    setError(null);
    (async () => {
      try {
        const result = await getAllAddons();
        setAppAddonsState((prev) => ({ ...prev, allAddons: result }));
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      }
    })();

    const addonsRef = ref(database, "addons");

    const addonsListener = onValue(addonsRef, (snapshot) => {
      const updatedAddons: Addon[] = [];

      snapshot.forEach((currentAddon) => {
        const addon = currentAddon.val();
        updatedAddons.push(addon);
      });

      setAppAddonsState((prev) => ({ ...prev, allAddons: updatedAddons }));
    });

    return () => {
      addonsListener();
    };
  }, []);

  return (
    <div className="main-content">
      <AddonsContext.Provider
        value={{ ...appAddonsState, setAllAddons: setAppAddonsState }}
      >
        {children}
        {error && <CustomSnackbarError error={error.message} />}
      </AddonsContext.Provider>
    </div>
  );
}
