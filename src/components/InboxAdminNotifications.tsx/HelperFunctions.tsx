import { updateAddonStatus } from "../../services/addon.services";

export const handleCopyDetails = async (downloadLink: string) => {
    const detailsToCopy = downloadLink;
    
    try {
      await navigator.clipboard.writeText(detailsToCopy);
    } catch (error) {
      console.error("Error copying addon details:", error);
    }
  };

  export const handleAcceptAddon = (addonId: string) => {
    updateAddonStatus(addonId, "published");
  };

  export const handleRejectAddon = (addonId: string) => {
    updateAddonStatus(addonId, "rejected");
  };