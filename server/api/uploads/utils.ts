import fileSystem from "fs";
import rimraf from "rimraf";
import { UploadObject } from "./types";

// Function to add new uploaded obj and return updated array.
const getUpdatedUploadsArray = (
  uploads: Array<UploadObject> = [],
  id: string,
  uploadedObj: UploadObject
): Array<UploadObject> => {
  uploads.forEach((file) => {
    if (file.type === "folder") {
      // push uploaded obj if type is folder and id is found.
      if (file.id === id) {
        file.files.push(uploadedObj);
      }

      if (file.files.length > 0) {
        getUpdatedUploadsArray(file.files, id, uploadedObj);
      }
    }
  });

  return uploads;
};

// Recursive function to get folder from assets folder.
const getUploadObjectRecursively = (
  files: Array<UploadObject>,
  id: string
): UploadObject | null => {
  let uploadObject = null;

  files.forEach((file) => {
    // return if file type is folder and id is found.
    if (file.type === "folder") {
      if (file.id === id) {
        uploadObject = file;
        return;
      }
      // if it has files, do the recursion.
      if (file.files.length > 0) {
        uploadObject = getUploadObjectRecursively(file.files, id);
        if (uploadObject !== null) return;
      }
    }
  });

  return uploadObject;
};

const removeSingleFile = (
  uploads: Array<UploadObject> = [],
  id: string
): Array<UploadObject> => {
  uploads.forEach((file, index) => {
    // Delete the found file from assets and uploads array.
    if (file.type !== "folder" && file.id === id) {
      try {
        fileSystem.unlinkSync(file.filePath);
      } catch (error) {
        console.error("Error removing file from assets!", error);
      }

      // Remove it from uploads array.
      uploads.splice(index, 1);
      return;
    }

    // If it has nested folders, recursively find the file and delete it.
    if (file.type === "folder" && file.files.length > 0) {
      removeSingleFile(file.files, id);
    }
  });

  return uploads;
};

const removeDirectory = (
  uploads: Array<UploadObject> = [],
  id: string
): Array<UploadObject> => {
  uploads.forEach((file, index) => {
    if (file.type === "folder") {
      if (file.id === id) {
        rimraf(file.folderPath, () => {
          console.log("Removed the directory with path -> ", file.folderPath);
        });

        // Remove it from uploads array.
        uploads.splice(index, 1);
        return;
      }

      if (file.files.length > 0) {
        removeDirectory(file.files, id);
      }
    }
  });

  return uploads;
};

const createNewDirectory = (path) =>
  fileSystem.mkdirSync(path, { recursive: true });

export {
  getUploadObjectRecursively,
  createNewDirectory,
  getUpdatedUploadsArray,
  removeDirectory,
  removeSingleFile,
};
