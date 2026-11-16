import { toast as sonnerToast } from "sonner";

// Keep Sonner's full API while requiring manual dismissal for errors.
export const toast = Object.assign(
  (...args: Parameters<typeof sonnerToast>) => sonnerToast(...args),
  sonnerToast,
  {
    error: (...[message, options]: Parameters<typeof sonnerToast.error>) =>
      sonnerToast.error(message, {
        ...options,
        duration: Infinity,
        closeButton: true,
      }),
  },
);
