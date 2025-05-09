import { database } from "../config/firebase.js";
import {
  get,
  ref,
  query,
  orderByChild,
  equalTo,
  push,
  update,
  remove,
  set,
  DataSnapshot,
  onValue,
} from "firebase/database";
import { deleteFileGitHub, deleteFilesFromGitHubStorage, getRepositoryContentsGitHub, setFileToGitHubStorage } from "./storage.services.js";
import { Addon } from "../context/AddonsContext.js";
import _ from "lodash";
import { deleteTagsForAddon, getTagsForAddon } from "./tag.services.js";
import { createVersion, deleteVersionsByAddonHandle } from "./version.services.js";
import { deleteReviewsForAddon } from "./review.services.js";
import { createStripePrice, createStripeProduct, getStripePriceByProductId, getStripeProductByAddonId, updateStripePrice } from "./payment.services.js";
import { Dispatch, SetStateAction } from "react";

export interface GitHubFile {
  name: string;
  path?: string;
  sha: string;
  size?: number;
  url?: string;
  html_url?: string;
  git_url?: string;
  download_url?: string;
  type?: 'file' | 'dir' | 'symlink' | 'submodule';
  _links?: {
    self: string;
    git: string;
    html: string;
  };
}

/**
 * Transforms the addon document snapshot into an array of addon objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the addons document.
 * @returns {Array} - An array of addon objects.
 */
export const fromAddonsDocument = (snapshot: DataSnapshot): Addon[] => {
  const addonsDocument = snapshot.val();

  return Object.keys(addonsDocument).map((key) => {
    const addon = addonsDocument[key];

    return {
      ...addon,
      id: key,
      uploadDate: new Date(addon.createdOn),
      ratings: addon.ratings ? Object.keys(addon.ratings) : [],
      tags: addon.tags ? Object.keys(addon.tags) : [],
      maintainers: addon.maintainers ? Object.keys(addon.maintainers) : [],
      images: addon.images ? Object.keys(addon.images) : [],
    };
  });
};

/**
 * Fetches a post by its ID.
 *
 * @param {string} id - The ID of the post to fetch.
 * @returns {Promise<Object>} - A promise that resolves with the fetched post object.
 * @throws {Error} - If the post with the specified ID does not exist.
 */
export const getAddonById = (id: string) => {
  return get(ref(database, `addons/${id}`)).then((result) => {
    if (!result.exists()) {
      throw new Error(`Addon with id ${id} does not exist!`);
    }

    const addon = result.val();

    return addon;
  });
};

/**
* Fetches addons authored by a specific user handle.
*
* @param {string} handle - The handle of the user.
* @returns {Promise<Array>} - A promise that resolves with an array of addons authored by the user.
*/
export const getAddonsByAuthor = (handle: string) => {
  return get(
    query(ref(database, "addons"), orderByChild("author"), equalTo(handle))
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];


    return fromAddonsDocument(snapshot);
  });
};

export const createAddon = async (
  name: string,
  description: string,
  targetIDE: string,
  file: File[],
  images: File[],
  userUid: string,
  originLink: string,
  company: string | null,
  logo: (File | undefined)[],
  version: string,
  versionInfo: string,
  price: string | number | readonly string[] | undefined
): Promise<Addon> => {
  const downloadLink = await setFileToGitHubStorage(file, 'Addons');
  const result = await push(ref(database, "addons"), {
    name,
    targetIDE,
    description,
    originLink,
    downloadLink,
    logo: logo.includes(undefined) ? null : await setFileToGitHubStorage(logo.filter((file): file is File => file !== undefined), 'Logos'),
    userUid,
    createdOn: Date.now(),
    addonId: "null",
    company,
    downloads: 0,
    rating: "0",
    status: 'pending',
    ownerUid: userUid,
    isFree: !price,
    price: price ? price : null,
    images: _.isEmpty(images) ? null : await setFileToGitHubStorage(images, 'Images')
  });

  if (result.key !== null) {

    const updateAddonIDequalToHandle: { [key: string]: string | null | string[] } = {};

    const newVersion = typeof downloadLink === "string" && await createVersion(version, downloadLink, result.key, versionInfo, userUid);
    updateAddonIDequalToHandle[`/addons/${result.key}/addonId`] = result.key;

    if (typeof newVersion === "string") {
      updateAddonIDequalToHandle[`/addons/${result.key}/versions`] = [newVersion];
    }
    await update(ref(database), updateAddonIDequalToHandle);

    return getAddonById(result.key);
  } else {
    throw new Error("Addon key is null");
  }
};

export const editAddon = async (
  currentAddonState: Addon,
  name: string,
  description: string,
  targetIDE: string,
  file: (File)[],
  images: (File)[],
  originLink: string,
  company: string,
  logo: (File)[],
  version: string,
  versionInfo: string,
  price: number | undefined | string
): Promise<Addon> => {
  const updates = {} as Addon;

  if (currentAddonState.name !== name) {
    updates.name = name;
  }

  if (currentAddonState.description !== description) {
    updates.description = description;
  }

  if (currentAddonState.targetIDE !== targetIDE) {
    updates.targetIDE = targetIDE;
  }

  if (currentAddonState.originLink !== originLink) {
    updates.originLink = originLink;
  }

  if (currentAddonState.company !== company && company !== null) {
    updates.company = company;
  }

  if (!currentAddonState.downloadLink.includes(file[0].name)) {
    try {
      const downloadLink = await setFileToGitHubStorage(file, 'Addons');
      if (typeof downloadLink === 'string') {
        updates.downloadLink = downloadLink;
        const newVersion = await createVersion(version, downloadLink, currentAddonState.addonId, versionInfo, currentAddonState.userUid);

        if (currentAddonState.versions && newVersion) {
          updates.versions = _.concat(currentAddonState.versions, newVersion);
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  if (logo[0] && !(currentAddonState.logo ? currentAddonState.logo : '').includes(logo[0].name)) {
    try {
      const logoLink = await setFileToGitHubStorage(logo.filter((file): file is File => file !== undefined), 'Logos');
      if (typeof logoLink === 'string') {
        updates.logo = logoLink;
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (currentAddonState.price !== price) {
    if (price) {
      updates.price = +price;
      updates.isFree = false;
    } else {
      updates.price = null;
    }

    try {
      if (price && !currentAddonState.price) {
        const productId = await createStripeProduct(name, currentAddonState.addonId);
        productId && await createStripePrice(productId, +price, currentAddonState.addonId);
      } else if (price && currentAddonState.price) {
        const priceId = await getStripePriceByProductId(currentAddonState.addonId);
        const productId = await getStripeProductByAddonId(currentAddonState.addonId);
        priceId && productId && await updateStripePrice(priceId, +price, productId, currentAddonState.addonId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const newImages = images
    .filter(image => !currentAddonState.images?.some(el => el.includes(image.name)));
  const oldImages = currentAddonState.images?.filter(el => images.some(image => image.name.includes(el.substring(el.lastIndexOf('/') + 1, el.length)))) || [];
  const imagesToDelete = currentAddonState.images?.filter(el => images.every(image => !image.name.includes(el.substring(el.lastIndexOf('/') + 1, el.length)))) || [];

  if (newImages.length !== 0 || oldImages?.length !== currentAddonState.images?.length) {

    try {
      const readyToAddURLs = newImages.length ? await setFileToGitHubStorage(newImages, 'Images') : [];
      if (Array.isArray(readyToAddURLs)) {
        updates.images = _.concat([], readyToAddURLs?.filter((url: string): url is string => url !== undefined), oldImages);
      }
    } catch (error) {
      console.log(error);
    }
  }

  try {
    await update(ref(database, `addons/${currentAddonState.addonId}`), updates);
    console.log("addon updated successfully!");

    if (imagesToDelete) {
      const allFiles = (await getRepositoryContentsGitHub('Images'))?.data.filter((el: GitHubFile) => imagesToDelete?.includes(el.download_url || ""));

      await deleteFileGitHub('Images', allFiles.map((el: GitHubFile) => ({ sha: el.sha, name: el.name })));
    }

    return getAddonById(currentAddonState.addonId);
  } catch (error) {
    console.error("Error updating addon:", error);
    throw error;
  }
};

/**
 * Fetches all addons from the database.
 *
 * @returns {Promise<Addon[]>} - A promise that resolves with an array of all addons.
 * @returns {Promise<Addon[]>} - A promise that resolves with an array of all addons.
 */


export const getAllAddons = async (): Promise<Addon[]> => {
    try {
      const snapshot = await get(ref(database, "addons")); // Assumes "addons" is the path to your addons data

      if (!snapshot.exists()) {
        return [];
      }

      const addonsData = snapshot.val();
      const addonsArray = Object.values(addonsData) as Addon[];
      return addonsArray;
    } catch (error) {
      console.error("Error fetching addons:", error);
      return [];
    }
};

/**
 * Fetches addons created by a specific user handle.
 *
 * @param {string} handle - The handle of the user.
 * @returns {Promise<Array>} - A promise that resolves with an array of addons created by the user.
 */
export const getAddonsByUser = async (handle: string): Promise<Addon[]> => {
  const snapshot = await get(
    query(ref(database, "addons"), orderByChild("author"), equalTo(handle))
  );
  if (!snapshot.exists()) return [];

  return fromAddonsDocument(snapshot);
};

/**
 * Update tags of an addon.
 *
 * @param {string} addonId - The ID of the addon to which tags will be added.
 * @param {Array<string>} tags - An array of tags to add to the addon.
 * @returns {Promise<void>} - A promise that resolves when the tags are successfully added to the addon.
 */
export const updateAddonTags = async (addonId: string, tags: string[]): Promise<void> => {
  const updateAddonTags: { [key: string]: string | boolean | null } = {};
  tags.map((tag) => {

    updateAddonTags[`/addons/${addonId}/tags/${tag}`] = true;
  });
  try {
    const currentTags = await getTagsForAddon(addonId);

    currentTags.map(tag => {
      if (!tags.includes(tag)) {
        updateAddonTags[`/addons/${addonId}/tags/${tag}`] = null;
      }
    })

  } catch (error) {
    console.log(error);

  }

  return update(ref(database), updateAddonTags);
};

export const updateAddonStatus = (addonId: string, newStatus: string) => {
  const updateStatus: { [key: string]: string } = {};
  updateStatus[`/addons/${addonId}/status/`] = newStatus;

  return update(ref(database), updateStatus);
};
export const updateAddonFeatureStatus = (addonId: string, newStatus: boolean) => {
  const updateStatus: { [key: string]: boolean } = {};
  updateStatus[`/addons/${addonId}/featured/`] = newStatus;

  return update(ref(database), updateStatus);
};

/**
 * Increments the download count of an addon.
 *
 * @param {string} addonId - The ID of the addon to increment the download count for.
 * @returns {Promise<void>}
 */
export const incrementDownloadCount = async (addonId: string): Promise<void> => {

  const downloadsRef = ref(database, `addons/${addonId}/downloads`);

  const currentCountSnapshot = await get(downloadsRef);
  const currentCount = currentCountSnapshot.val();

  await set(downloadsRef, currentCount + 1);
}


export const deleteAddonAndRelatedData = async (addonId: string): Promise<void> => {
  try {
    // Fetch addon details by addonId
    const addon = await getAddonById(addonId);

    if (!addon) {
      console.log(`Addon with addonId ${addonId} not found`);
      return;
    }

    await deleteVersionsByAddonHandle(addonId);

    await deleteReviewsForAddon(addonId);

    await deleteTagsForAddon(addonId);

    // Delete images associated with the addon
    if (addon.images) {
      await deleteFilesFromGitHubStorage(addon.images, 'Images');
    }

    // Delete logo associated with the addon
    if (addon.logo) {
      await deleteFilesFromGitHubStorage([addon.logo], 'Logos');
    }

    // Delete file set in GitHub storage
    if (addon.downloadLink) {
      await deleteFilesFromGitHubStorage([addon.downloadLink], 'Addons');
    }

    // Delete addon data
    await remove(ref(database, `addons/${addonId}`));

    console.log(`Addon with addonId ${addonId} and associated data deleted successfully`);
  } catch (error) {
    console.error(error);
  }
};


/**
 * Fetches addons created by a specific user handle.
 *
 * @param {string} handle - The handle of the user.
 * @returns {Promise<Array>} - A promise that resolves with an array of addons created by the user.
 */
export const getAddonsByUserUid = async (userUid: string): Promise<Addon[]> => {
  const snapshot = await get(
    query(ref(database, "addons"), orderByChild("userUid"), equalTo(userUid))
  );
  if (!snapshot.exists()) return [];

  return fromAddonsDocument(snapshot);
};

export const addAddonContributor = async (userUid: string[], addonId: string, userRole: string) => {
  try {
    if (userRole === "Maintainer") {
      const contributorsRef = ref(database, `addons/${addonId}/contributors`);
      let updatedContributors = (await get(contributorsRef)).val() || [];
      updatedContributors = updatedContributors.concat(userUid);

      await set(contributorsRef, [...updatedContributors]);

    } else if (userRole === "Owner") {
      const updateStatus: { [key: string]: string } = {};
      updateStatus[`/addons/${addonId}/ownerUid/`] = userUid[0];

      return update(ref(database), updateStatus);
    }

  } catch (error) {
    console.log(error);
  }


}

export const removeAddonContributor = async (userUid: string, addonId: string) => {
  try {
    const contributorsRef = ref(database, `addons/${addonId}/contributors`);

    const updatedContributors = (await get(contributorsRef)).val().filter((el: string) => el !== userUid);

    await set(contributorsRef, [...updatedContributors]);

  } catch (error) {
    console.log(error);
  }
}

export const fetchAddonsAndUpdateState = (setData: Dispatch<SetStateAction<Addon[]>>, setPendingAddons: Dispatch<SetStateAction<boolean>> | string) => {
  const addonsRef = ref(database, "addons");

  const addonsListener = onValue(addonsRef, (snapshot) => {
    const updatedAddons: Addon[] = [];

    snapshot.forEach((childSnapshot) => {
      const addon = childSnapshot.val();
      updatedAddons.push(addon);
    });

    setData(updatedAddons);

    if (setPendingAddons) {
      const pendingAddonsFilter = updatedAddons.filter(
        (addon) => addon.status === "pending"
      );
      if (pendingAddonsFilter.length > 0 && typeof setPendingAddons !== "string") {
        setPendingAddons(true);
      }
    }
   
  });

  return () => {
    addonsListener();
  };
};

