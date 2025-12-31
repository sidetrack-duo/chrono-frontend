import { useToastStore, Toast as ToastType } from "@/stores/toastStore";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastType; onClose: () => void }) {

  const variants = {
    success: "bg-primary text-white",
    error: "bg-accent text-white",
    info: "bg-white text-gray-700 border-gray-300",
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg min-w-[300px] max-w-[400px] ${variants[toast.type]}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 rounded p-1 hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

