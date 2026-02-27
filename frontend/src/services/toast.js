import toast from "react-hot-toast";

// Success toast
export const showSuccess = (msg) =>
  toast.success(msg, {
    duration: 3000,
    position: "top-right",
  });

// Error toast
export const showError = (msg) =>
  toast.error(msg, {
    duration: 5000,
    position: "top-right",
  });

// Info / default toast
export const showInfo = (msg) =>
  toast(msg, {
    duration: 3000,
    position: "top-right",
  });

// Promise toast
export const showPromise = (promise, messages = {}) => {
  return toast.promise(promise, {
    loading: messages.loading || "Processing...",
    success: messages.success || "Success!",
    error: messages.error || "Error!",
    position: "top-right",
  });
};