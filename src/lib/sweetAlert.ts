import Swal from "sweetalert2";
import { Messages } from "./config";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

const modernToastConfig = {
  toast: true,
  position: "top-end" as const,
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: {
    popup: 'modern-swal-popup',
    container: 'modern-swal-container',
    timerProgressBar: 'modern-swal-progress-bar',
  },
  background: '#FFFFFF',
  color: '#1D1D1F',
  iconColor: '#34C759',
  confirmButtonColor: '#007AFF',
  showClass: {
    popup: 'swal2-show-modern',
  },
  hideClass: {
    popup: 'swal2-hide-modern',
  },
};

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  
  await Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    showConfirmButton: true,
    confirmButtonText: "OK",
    confirmButtonColor: "#007AFF",
    background: "#FFFFFF",
    color: "#1D1D1F",
    customClass: {
      popup: 'modern-swal-popup',
      title: 'modern-swal-title',
      confirmButton: 'modern-swal-button',
      htmlContainer: 'modern-swal-html',
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    allowEscapeKey: true,
    showClass: {
      popup: 'swal2-show-modern',
    },
    hideClass: {
      popup: 'swal2-hide-modern',
    },
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 1000
) => {
  const Toast = Swal.mixin({
    ...modernToastConfig,
    timer: duration,
    icon: "success",
    iconColor: "#34C759",
  });

  await Toast.fire({
    title: msg,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 1000
) => {
  const Toast = Swal.mixin({
    ...modernToastConfig,
    timer: duration,
    icon: "success",
    iconColor: "#34C759",
  });

  Toast.fire({
    title: msg,
  }).then();
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
    confirmButtonColor: "#007AFF",
    background: "#FFFFFF",
    color: "#1D1D1F",
    customClass: {
      popup: 'modern-swal-popup',
      title: 'modern-swal-title',
      confirmButton: 'modern-swal-button',
    },
    buttonsStyling: false,
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};

export const sweetConfirmDialog = async (
  title: string,
  text: string,
  confirmText: string = "Confirm",
  cancelText: string = "Cancel"
): Promise<boolean> => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#007AFF",
    cancelButtonColor: "#6E6E73",
    background: "#FFFFFF",
    color: "#1D1D1F",
    reverseButtons: false,
    customClass: {
      popup: 'modern-swal-popup',
      title: 'modern-swal-title',
      confirmButton: 'modern-swal-button',
      cancelButton: 'modern-swal-cancel-button',
      htmlContainer: 'modern-swal-html',
      actions: 'modern-swal-actions',
    },
    buttonsStyling: false,
    showClass: {
      popup: 'swal2-show-modern',
    },
    hideClass: {
      popup: 'swal2-hide-modern',
    },
  });

  return result.isConfirmed;
};
