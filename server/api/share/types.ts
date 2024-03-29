import { UploadObject } from "../uploads/types";

type SharedFileObject = {
  id?: string;
  file: UploadObject;
  sharedBy: SharedBy;
  createdAt: number;
};

type SharedBy = {
  name: string;
  email: string;
};

interface Recipient extends SharedBy {
  sharedObjectInfo: {
    id: string;
    sharedAt: number;
  };
}

interface PublicLink extends SharedFileObject {
  hash: string;
}

export type { SharedFileObject, Recipient, PublicLink };
