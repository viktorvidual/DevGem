import _ from 'lodash';
import { DUPLICATE_FILE, DUPLICATE_NAME, DUPLICATE_VERSION, IMAGE_DIR_GITHUB, INVALID_COMPANY, INVALID_DESCRIPTION, INVALID_FILE, INVALID_IDE, INVALID_NAME, INVALID_ORIGIN_LINK, INVALID_TAG, INVALID_VERSION, INVALID_VERSION_INFO, MAX_ADDON_DESCR_LEN, MAX_ADDON_NAME_LEN, MAX_COMPANY_LEN, MIN_ADDON_DESCR_LEN, MIN_ADDON_NAME_LEN } from '../../common/common.ts';
import { getFileDataFromGitHub } from '../../services/storage.services.ts';
import { Addon } from '../../context/AddonsContext.ts';
import { getVersionById } from '../../services/version.services.ts';

export async function isValidName(name: string, allAddons: Addon[] | undefined): Promise<string | null> {
  if (name.length < MIN_ADDON_NAME_LEN || name.length > MAX_ADDON_NAME_LEN) {
    return INVALID_NAME;
  }

  const isUnique = allAddons ? allAddons.every(addon => !(addon.name === name)) : true;

  if (!isUnique) {
    return DUPLICATE_NAME;
  }

  return null;
}

export function isValidTag(tags: string[]): string | null {
  return _.isEmpty(tags) ? INVALID_TAG : null
}

export function isValidIDE(IDE: string[]): string | null {
  return _.isEmpty(IDE) ? INVALID_IDE : null;
}

export function isValidDescription(description: string): string | null {
  return _.isEmpty(description) || description.length < MIN_ADDON_DESCR_LEN 
  || description.length > MAX_ADDON_DESCR_LEN ? INVALID_DESCRIPTION : null;
}

export function isValidCompany(description: string): string | null {
  return description.length > MAX_COMPANY_LEN ? INVALID_COMPANY : null;
}

export const isValidOriginLink = (urlString: string): string | null => {
  try {
    const pattern = /^https?:\/\/github\.com\/[^/]+\/[^/]+$/;
    if (!pattern.test(urlString)) {
      throw new Error('Invalid URL');
    }
    Boolean(new URL(urlString));
    return null;
  }
  catch (e) {
    return INVALID_ORIGIN_LINK;
  }
}

export async function isValidFile(file: string, inputLabel: string): Promise<string | null> {

  if (_.isEmpty(file) && inputLabel === 'Plugin file') {
    return INVALID_FILE;
  }

  if (inputLabel === 'Plugin file') {
    try {

      const currentFile = await getFileDataFromGitHub(`https://raw.githubusercontent.com/MariaKaramfilova/Addonis/main/Addons/${file.replace(/ /g, '')}`, 'Addons');

      if (currentFile.name) {
        return DUPLICATE_FILE;
      }
    } catch (error) {
      console.log(error);
    }
  }

  if ((inputLabel === 'Logo' || inputLabel === IMAGE_DIR_GITHUB) && !_.isEmpty(file)) {
    try {
      
      const currentFile = await getFileDataFromGitHub(`https://raw.githubusercontent.com/MariaKaramfilova/Addonis/main/${inputLabel}s/${file.replace(/ /g, '')}`, `${inputLabel}s`);
      console.log(currentFile);
      
      if (currentFile.name) {
        return DUPLICATE_FILE;
      }

    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

export const isValidVersion = async (version: string, _: Addon[] | undefined, addon?: Addon): Promise<string | null> => {
  const regex = new RegExp(/^\d+(\.\d+)*$/);

  if (addon) {
    try {
      const matcherArr = await Promise.all(addon?.versions.map(async (id) => {
        const v = await getVersionById(id);
        return v.name === version;
      }));
  
      if (matcherArr?.includes(true)) {
        return DUPLICATE_VERSION;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return !regex.test(version) ? INVALID_VERSION : null;
}

export function isValidVersionInfo(versionInfo: string): string | null {
  return !_.isEmpty(versionInfo) && (versionInfo.length < 5 || versionInfo.length > 40) ? INVALID_VERSION_INFO : null;
}