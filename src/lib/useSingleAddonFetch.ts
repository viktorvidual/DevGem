import { Dispatch, SetStateAction, useEffect } from 'react';
import { Addon } from '../context/AddonsContext.ts';
import { getAddonById } from '../services/addon.services.ts';

export const useSingleAddonFetch = (
  addonId: string | undefined, 
  setError: Dispatch<SetStateAction<string | null>>,
  setAddon: Dispatch<SetStateAction<Addon>>) => {
  
  useEffect(() => {
    (async () => {
      try {
        if (addonId) {
          const response = await getAddonById(addonId);
          setAddon(response);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    })();
  }, [addonId, setAddon, setError]);
}