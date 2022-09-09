import { toast, ToastOptions } from "react-toastify";

const TOAST_SETTINGS: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  closeOnClick: true,
  hideProgressBar: true,
};

const notifySuccess = (notificationText: string) =>
  toast.success(notificationText, TOAST_SETTINGS);

const notifyWarning = (notificationText: string) =>
  toast.warning(notificationText, TOAST_SETTINGS);

const notifyError = (notificationText: string) =>
  toast.error(notificationText, TOAST_SETTINGS);

export { notifySuccess, notifyError, notifyWarning };
