import { IDE } from "../components/SelectCreatable/selectCreatableHelpers.js";
import { database } from "../config/firebase.js";
import {
  get,
  ref,
  push,
  update,
  DataSnapshot,
} from "firebase/database";

const fromIDEsDocument = (snapshot: DataSnapshot): IDE[] => {
  const IDEsDocument = snapshot.val();

  return Object.keys(IDEsDocument).map((key) => {
    const IDE = IDEsDocument[key];

    return {
      ...IDE,
      id: key,
      createdOn: new Date(IDE.createdOn),
    };
  });
};

export const createIDE = async (name: string): Promise<IDE> => {
  const result = await push(ref(database, "IDEs"), {
    name,
    createdOn: Date.now(),
    IDEId: null,
  });

  if (result.key !== null) {
    const updatePostIDequalToHandle: { [key: string]: string | null } = {};
    updatePostIDequalToHandle[`/IDEs/${result.key}/IDEId`] = result.key;
    await update(ref(database), updatePostIDequalToHandle);

    return getIDEById(result.key);
  } else {
    throw new Error("IDE key is null");
  }
};

export const getIDEById = async (id: string): Promise<IDE> => {
  const result = await get(ref(database, `IDEs/${id}`));
  if (!result.exists()) {
    throw new Error(`IDE with id ${id} does not exist!`);
  }
  const IDE = result.val();
  return IDE;
};

export const getAllIDEs = async (): Promise<IDE[]> => {
  const snapshot = await get(ref(database, "IDEs"));
  if (!snapshot.exists()) {
    return [];
  }

  return fromIDEsDocument(snapshot);
};

export const updateIDEs = async (newIDEs: string[]): Promise<void> => {
  try {
    const allIDEs = await getAllIDEs();
    const allIDEsSimpleList = allIDEs.map((el) => el.name);
    const IDEsToCreate = newIDEs.filter((el) => !allIDEsSimpleList.includes(el));

    await Promise.all(IDEsToCreate.map(async (el) => {
      try {
        await createIDE(el);
      } catch (error) {
        console.log(`Error creating a IDE: ${error}`);
      }
    }));
  } catch (error) {
    console.log(`Failed to update IDEs: ${error}`);
  }
};

export const getIDEsForAddon = async (addonId: string | undefined): Promise<string[]> => {
  const result = await get(ref(database, `addons/${addonId}`));
  if (!result.exists()) {
    return [];
  } else {
    const addon = result.val();
    return [addon.targetIDE];
  }
}
