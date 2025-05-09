import { EMPTY_FILE, IMAGE_DIR_GITHUB, INVALID_FILE_TYPE, MAX_FILE_SIZE, tenMB } from "../../common/common.ts";

export const validateDropzoneFile = async (file: File, validateValue: (value: string, type: string) => Promise<string | null>) => {

  const data = await validateValue(file.name, IMAGE_DIR_GITHUB);

  if (data) {
    return {
      flag: false,
      error: data
    };
  }

  if (
    file.type.split("/")[1] !== "gif" &&
    file.type.split("/")[1] !== "png" &&
    file.type.split("/")[1] !== "jpeg"
  ) {
    return {
      flag: false,
      error: INVALID_FILE_TYPE
    };
  }

  if (file.size <= 0) {
    return {
      flag: false,
      error: EMPTY_FILE
    };
    
  } else if (file.size > tenMB) {
    return {
      flag: false,
      error: MAX_FILE_SIZE
    };
  }

  return {
    flag: true,
    error: ""
  };
}

