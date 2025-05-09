import { Tag } from "../components/SelectCreatable/selectCreatableHelpers.js";
import { database } from "../config/firebase.js";
import {
  get,
  ref,
  push,
  update,
  DataSnapshot,
  remove,
} from "firebase/database";

const fromTagsDocument = (snapshot: DataSnapshot): Tag[] => {
  const tagsDocument = snapshot.val();

  return Object.keys(tagsDocument).map((key) => {
    const tag = tagsDocument[key];

    return {
      ...tag,
      id: key,
      createdOn: new Date(tag.createdOn),
    };
  });
};

export const createTag = async (name: string): Promise<Tag> => {
  const result = await push(ref(database, "tags"), {
    name,
    createdOn: Date.now(),
    tagId: null,
  });
  

  if (result.key !== null) {
    const updatePostIDequalToHandle: { [key: string]: string | null } = {};
    updatePostIDequalToHandle[`/tags/${result.key}/tagId`] = result.key;
    await update(ref(database), updatePostIDequalToHandle);

    return getTagById(result.key);
  } else {
    throw new Error("Tag key is null");
  }
};

export const getTagById = async (id: string): Promise<Tag> => {
  const result = await get(ref(database, `tags/${id}`));
  if (!result.exists()) {
    throw new Error(`Tag with id ${id} does not exist!`);
  }
  const tag = result.val();
  return tag;
};

export const getAllTags = async (): Promise<Tag[]> => {
  const snapshot = await get(ref(database, "tags"));
  if (!snapshot.exists()) {
    return [];
  }

  return fromTagsDocument(snapshot);
};

export const updateTags = async (newTags: string[]): Promise<void> => {
  try {
    const allTags = await getAllTags();
    const allTagsSimpleList = allTags.map((el) => el.name);
    const tagsToCreate = newTags.filter((el) => !allTagsSimpleList.includes(el));

    await Promise.all(tagsToCreate.map(async (el) => {
      try {
        await createTag(el);
      } catch (error) {
        console.log(`Error creating a tag: ${error}`);
      }
    }));
  } catch (error) {
    console.log(`Failed to update tags: ${error}`);
  }
};

export const getTagsForAddon = async (addonId: string | undefined): Promise<string[]> => {
  const result = await get(ref(database, `addons/${addonId}`));
  if (!result.exists()) {
    return [];
  } else {
    const addon = result.val();
    return addon.tags ? Object.keys(addon.tags) : [];
  }
}

export const deleteTagsForAddon = async (addonId: string): Promise<void> => {
  try {
 
    const tagIds = await getTagsForAddon(addonId);

    if (tagIds.length === 0) {
      console.log(`No tags found for addonId ${addonId}`);
      return;
    }


    const deletionPromises = tagIds.map(async (tagId) => {
      await remove(ref(database, `tags/${tagId}`));

    });


    await Promise.all(deletionPromises);

    console.log(`All tags for addonId ${addonId} deleted successfully`);
  } catch (error) {
    console.error(error);
  }
};

