import fileSystem from "fs";
import { UploadObject } from "./types";

// Function to add new uploaded obj and return updated array.
const getUpdatedUploadsArray = (
  uploads: Array<UploadObject> = [],
  id,
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
  id
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

const createNewDirectory = (path) =>
  fileSystem.mkdirSync(path, { recursive: true });

export { getUploadObjectRecursively, createNewDirectory, getUpdatedUploadsArray };
