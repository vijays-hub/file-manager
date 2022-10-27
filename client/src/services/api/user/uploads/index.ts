import { apiInstance } from "config/axios";

const uploadFiles = async (form: FormData) =>
  await apiInstance({
    "Content-Type": "multipart/form-data",
  }).post("/uploads", form, {
    params: {
      // id: "e92b2010-513a-4b52-b69c-a82142c14675",
    },
  });

export { uploadFiles };
