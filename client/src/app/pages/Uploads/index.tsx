import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFiles } from "services/api/user/uploads";
import { APIResponse } from "types";
import { extractErrorInfo } from "utils";
import { notifyError, notifySuccess } from "utils/notifications";

const ManageUploads = () => {
  const navigate = useNavigate();

  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const returnToDashboard = () => navigate("/dashboard");

  const handleFilesChange = (files: FileList) => {
    // Craete an array out of FileList object and append each file to the form data.
    const uploadedFiles = [] as File[];
    Array.from(files).forEach((file) => {
      uploadedFiles.push(file);
    });
    setFilesToUpload(uploadedFiles);
  };

  const uploadSelectedFiles = async () => {
    try {
      const form = new FormData();

      // Append each file to the form data.
      filesToUpload.forEach((file) => {
        form.append("filesToUpload", file);
      });

      const { data }: { data: APIResponse } = await uploadFiles(form);
      if (data) {
        notifySuccess("Uploaded selected files to the server.");
        returnToDashboard();
      }
    } catch (error) {
      notifyError(extractErrorInfo(error as AxiosError));
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        multiple
        onChange={({ target: { files } }) => {
          if (files && files?.length > 0) handleFilesChange(files);
          return;
        }}
        // Reset the previous file. This allows to pick the same file from the File Selector.
        onClick={(event: any) => {
          setFilesToUpload([]);
          event.target.value = null;
        }}
      />

      <br />
      <br />

      <button
        style={{ border: "1px solid green" }}
        onClick={() => uploadSelectedFiles()}
        disabled={filesToUpload.length <= 0}
      >
        Upload Files
      </button>

      <br />
      <br />

      <button
        style={{ border: "1px solid green" }}
        onClick={() => returnToDashboard()}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ManageUploads;
