type UploadObject = {
  id: string;
  type: string;
  size?: number;
  files?: Array<UploadObject>;
  fileName?: string;
  filePath?: string;
  folderName?: string;
  folderPath?: string;
  createdAt: number;
};

type RenameData = {
  uploads: Array<UploadObject>;
  id: string;
  latestName: string;
};

export type { UploadObject, RenameData };
