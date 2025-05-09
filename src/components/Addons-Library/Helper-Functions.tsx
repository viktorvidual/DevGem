import { Addon } from "../../context/AddonsContext";

export function truncateText(text: string | undefined | null, maxLength: number) {
  if (!text) {
    return '';
  }

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
  }

  export function sortAddons(addons: Addon[], NUM_CARDS_IN_HOMEPAGE: number) {
    if (addons.length > 0) {
      const sortedAddonsByDownload = addons
        .slice()
        .sort((a, b) => b.downloads - a.downloads);
      const topDownloads = sortedAddonsByDownload.slice(0, NUM_CARDS_IN_HOMEPAGE);
  
      const sortedAddonsByRating = addons
        .slice()
        .sort((a, b) => b.rating - a.rating);
      const topRatings = sortedAddonsByRating.slice(0, NUM_CARDS_IN_HOMEPAGE);
  
      const sortedByDate = addons
        .slice()
        .sort(
          (a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
      const topNewAddons = sortedByDate.slice(0, NUM_CARDS_IN_HOMEPAGE);
  
      const featuredAddons = addons
        .slice()
        .filter((addon: Addon) => addon.featured === true)
        .slice(0, NUM_CARDS_IN_HOMEPAGE);
  
      return { topDownloads, topRatings, topNewAddons, featuredAddons };
    } else {
      return { topDownloads: [], topRatings: [], topNewAddons: [], featuredAddons: [] };
    }
  }

export function filterAddons(addons: Addon[], selectedIDE: string, searchSelectedIDE: string) {
  const filteredAddons = [];

  if (selectedIDE !== 'All platforms' && selectedIDE) {
    const filteredBySelectedIDE = addons.filter((addon) => addon.targetIDE === selectedIDE);
    filteredAddons.push(...filteredBySelectedIDE);
  }

  if (searchSelectedIDE !== 'All platforms' && searchSelectedIDE) {
    const filteredBySearchSelectedIDE = addons.filter((addon) => addon.targetIDE === searchSelectedIDE);
    filteredAddons.push(...filteredBySearchSelectedIDE);
  }

  return filteredAddons;
}
