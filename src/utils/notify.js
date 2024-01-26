import { toast } from "react-toastify";

export const notify = (message, type) => {
  // Calling toast method by passing string
  if (type === "error") {
    toast.error(message);
  } else {
    toast(message);
  }
};
