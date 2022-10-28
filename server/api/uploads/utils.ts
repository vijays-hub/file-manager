import fileSystem from "fs";
import rimraf from "rimraf";
import { SharedFileObject } from "../share/types";
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

// Recursive function to get folder from uploads.
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

// Recursive function to get file from uploads.
const getSingleFileRecursively = (
  files: Array<UploadObject>,
  id: string
): UploadObject | null => {
  let singleFile = null;

  files.forEach((file) => {
    console.log("File ", file);
    if (file.type !== " folder" && file.id === id) {
      singleFile = file;
      return;
    }

    // If it is a folder and has nested files in it, recursively get the file.
    if (file.type === "folder" && file.files.length > 0) {
      singleFile = getSingleFileRecursively(file.files, id);
      if (singleFile !== null) return singleFile;
    }
  });

  return singleFile;
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

const renameDirectory = (oldPath, latestPath) =>
  fileSystem.rename(oldPath, latestPath, () => {
    console.log("Successfully modified the directory");
  });

const getSharedAssetsRecursively = (sharedFiles, id: string): UploadObject => {
  let singleFile = null;

  sharedFiles.forEach((sharedFileInfo) => {
    const file =
      typeof sharedFileInfo?.file === "undefined"
        ? sharedFileInfo
        : sharedFileInfo.file;

    if (file.type === " folder") {
      if (file.id === id) {
        singleFile = file;
        return;
      }

      // If it is a folder and has nested files in it, recursively get the file.
      if (file.files.length > 0) {
        singleFile = getSharedAssetsRecursively(file.files, id);
        if (singleFile !== null) return singleFile;
      }
    }

    // File is not a folder.
    singleFile = file;
    return;
  });

  return singleFile;
};

export {
  getUploadObjectRecursively,
  getSingleFileRecursively,
  getSharedAssetsRecursively,
  createNewDirectory,
  renameDirectory,
  getUpdatedUploadsArray,
  removeDirectory,
  removeSingleFile,
};
