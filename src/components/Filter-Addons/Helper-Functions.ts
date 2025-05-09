import { Addon } from "../../context/AddonsContext";

export function sortAddons(addons: Addon[], filter: string | undefined) {
  if (filter === "top-downloads") {
    return addons.slice().sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

  } else if (filter === "top-rated") {
    return addons.slice().sort((a, b) => b.rating - a.rating);

  } else if (filter === "new-addons") {
    return addons.slice().sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());

  } else if (filter === 'featured') {
    return addons.slice().filter((addon) => addon.featured === true);

  } else if (filter === 'Name') {
    return addons.slice().sort((a, b) => a.name.localeCompare(b.name))

  } else if (filter === 'Creator') {
    return addons.slice().sort((a, b) => ((a ? a.company : '') || '').localeCompare((b ? b.company : '') || ''));

  } else if (filter === 'Number of downloads(Desc)') {
    return addons.slice().sort((a, b) => b.downloads - a.downloads)

  } else if (filter === 'Number of downloads(Asc)') {
    return addons.slice().sort((a, b) => a.downloads - b.downloads)

  } else if (filter === 'Tags') {
    return addons.slice().sort((a, b) => Object.values(b.tags).length - Object.values(a.tags).length)

  } else if (filter === 'Upload date(Desc)') {
    return addons.slice().sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())

  } else if (filter === 'Upload date(Asc)') {
    return addons.slice().sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
  }

  return addons;
}
export function filterAddons(addons: Addon[], searchSelectedIDE: string | null, filter: string | undefined, searchQuery: string | null) {
  let filtered = addons;

  if (searchSelectedIDE && searchSelectedIDE !== 'All platforms') {
    filtered = filtered.filter((addon) => addon.targetIDE === searchSelectedIDE);
  }

  if (filter === "search") {
    filtered = filtered.filter((addon) =>
      searchQuery && addon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
}

export function filterAddonsByPaymentStatus(addons: Addon[], currentFilter: string) {
  if (currentFilter === "paid") {
    return addons.filter((addon) => addon.isFree === false);
  } else if (currentFilter === "free") {
    return addons.filter((addon) => addon.isFree === true);
  } else {
    return addons;
  }
}