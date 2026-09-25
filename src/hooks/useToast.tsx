import { App } from "antd";
import type { ReactNode } from "react";
import { HiCheckCircle, HiExclamationTriangle, HiInformationCircle, HiXCircle } from "react-icons/hi2";
import { LuX } from "react-icons/lu";

type ToastType = "success" | "error" | "warning" | "info";

type ToastAction = {
  label: string;
  onClick: () => void;
};

const TOAST_STYLES: Record<ToastType, { icon: ReactNode; iconClass: string }> = {
  success: { icon: <HiCheckCircle />, iconClass: "text-toast-success" },
  error: { icon: <HiXCircle />, iconClass: "text-toast-error" },
  warning: { icon: <HiExclamationTriangle />, iconClass: "text-toast-warning" },
  info: { icon: <HiInformationCircle />, iconClass: "text-toast-info" },
};

const closeButtonClasses = [
  "[&_.ant-notification-notice-close]:top-2.5",
  "[&_.ant-notification-notice-close]:end-2.5",
  "[&_.ant-notification-notice-close]:size-6",
  "[&_.ant-notification-notice-close]:rounded-md",
  "[&_.ant-notification-notice-close]:text-white/50",
  "[&_.ant-notification-notice-close:hover]:bg-white/10",
  "[&_.ant-notification-notice-close:hover]:text-white",
].join(" ");

export function useToast() {
  const { notification } = App.useApp();

  function show(type: ToastType, title: string, description?: string, action?: ToastAction) {
    const { icon, iconClass } = TOAST_STYLES[type];
    const isUrgent = type === "error" || type === "warning";

    notification.open({
      icon: null,
      title: (
        <span className="flex items-center gap-3">
          <span className={`flex shrink-0 [&_svg]:size-5 ${iconClass}`} aria-hidden>
            {icon}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-ui leading-5 font-semibold text-white">{title}</span>
            {description && <span className="text-2xs leading-4 font-normal text-white/65">{description}</span>}
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="mt-2 flex h-7 w-fit cursor-pointer items-center rounded-md bg-white px-2.5 text-2xs font-semibold text-ink hover:bg-white/90 focus-visible:outline-white"
              >
                {action.label}
              </button>
            )}
          </span>
        </span>
      ),
      closeIcon: <LuX className="size-3.5" />,
      pauseOnHover: true,
      duration: type === "error" ? 6 : 4,
      role: isUrgent ? "alert" : "status",
      classNames: {
        root: `rounded-lg border border-white/10 bg-toast-bg py-3 pr-10 pl-3.5 text-white shadow-overlay ${closeButtonClasses}`,
        title: "m-0",
        description: "hidden",
      },
    });
  }

  return {
    success: (title: string, description?: string, action?: ToastAction) => show("success", title, description, action),
    error: (title: string, description?: string, action?: ToastAction) => show("error", title, description, action),
    warning: (title: string, description?: string, action?: ToastAction) => show("warning", title, description, action),
    info: (title: string, description?: string, action?: ToastAction) => show("info", title, description, action),
  };
}
