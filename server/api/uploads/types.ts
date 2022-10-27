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

export type { UploadObject };
