import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase.ts";
import { octokit } from "../config/github.octokit.ts";
import { GITHUB_REPO_NAME, GITHUB_OWNER_NAME } from "../common/common.ts";
import { GitHubFile } from "./addon.services.ts";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 *
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - A promise that resolves with the download URL of the uploaded file.
 */
export const setFileToFirebaseStorage = async (file: File): Promise<string> => {
  const imageRef = ref(storage, `images/${file.name}`);

  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);

  return url;
};

const convertFileToBase64String = (file: File) => {

  return new Promise((resolve, reject) => {
    const fileContent = new FileReader();
    fileContent.onload = () => {
      if (typeof fileContent.result === 'string') {
        const base64String = btoa(fileContent.result);
        resolve(base64String);
      } else {
        reject(new Error('FileReader result is not a string'));
      }
    };
    fileContent.onerror = (error) => {
      reject(error);
    };
    fileContent.readAsBinaryString(file);
  });
}


/**
 * Uploads a file to GitHub Storage and returns the download URL.
 *
 * @param {File} files - The file to upload.
 * @returns {Promise<string>} - A promise that resolves with the download URL of the uploaded file.
 */
export const setFileToGitHubStorage = async (files: File[], path: string): Promise<string[] | undefined | string> => {

  const responseArr: string[] = [];
  try {
    await Promise.all(files.map(async (file) => {
      const cleanFileName = file.name.replace(/ /g, '');

      const base64String = await convertFileToBase64String(file);
      const fileRef = await octokit.request(`PUT /repos/${GITHUB_OWNER_NAME}/${GITHUB_REPO_NAME}/contents/${path}/${cleanFileName}`, {
        owner: GITHUB_OWNER_NAME,
        repo: GITHUB_REPO_NAME,
        content: base64String,
        path: `${path}/${cleanFileName}`,
        message: `Upload new file: ${cleanFileName}`,
      })
      responseArr.push(fileRef.data.content.download_url);
    }))

    return responseArr.length === 1 && path !== "Images" ? responseArr[0] : responseArr;
  } catch (error) {
    console.log(error);
  }
};

export const getRepositoryContentsGitHub = async (path: string) => {
  try {
    const response = await octokit.request(`GET /repos/${GITHUB_OWNER_NAME}/${GITHUB_REPO_NAME}/contents/${path}`, {
      owner: GITHUB_OWNER_NAME,
      repo: GITHUB_REPO_NAME,
      path: path,
    })
    return response;
  } catch (error) {
    console.log(error);
  }

}

export const deleteFileGitHub = async (path: string, shaArr: GitHubFile[]) => {
  try {
    await Promise.all(shaArr.map(async (file) => {
      await octokit.request(`DELETE /repos/${GITHUB_OWNER_NAME}/${GITHUB_REPO_NAME}/contents/${path}/${file.name}`, {
        owner: GITHUB_OWNER_NAME,
        repo: GITHUB_REPO_NAME,
        path: `${path}/${file.name}`,
        message: `Delete ${file.sha}`,
        sha: file.sha,
      })
    }))
  } catch (error) {
    console.log(error);
  }
}

export const getFileDataFromGitHub = async (fileUrl: string, path: string): Promise<GitHubFile> => {
  
  const fetchURL = fileUrl.split('/').reverse()
  const filePath = fetchURL[0]

  const source = `https://api.github.com/repos/${GITHUB_OWNER_NAME}/${GITHUB_REPO_NAME}/contents/${path}/${filePath}`
  console.log(source);
  
  try {
    const response = await fetch(source);
    const data = await response.json();
    const fileName = data.name;
    const sha = data.sha;
    return {
      name: fileName,
      sha: sha
    };
  } catch (error) {
    throw new Error(`Error fetching file data from GitHub: ${error}`);
  }
};

export const deleteFilesFromGitHubStorage = async (fileUrls: string[], path: string,): Promise<void> => {
  try {
    const shaArr = await Promise.all(fileUrls.map(async (url) => {
      const fileData = await getFileDataFromGitHub(url, path);
      return {
        name: fileData.name,
        sha: fileData.sha
      };
    }));
    
    await deleteFileGitHub(path, shaArr);
    console.log(`storage ${path} deleted`);
    
  } catch (error) {
    console.error(error);
  }
};



