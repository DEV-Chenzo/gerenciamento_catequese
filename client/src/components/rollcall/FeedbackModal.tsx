import { FeedbackModalProps } from "@/lib/props/FeedbackModalProps";

export default function FeedbackModal({
  message,
  onClose,
  bgColor,
  bgColorHover,
  borderColor,
  textColor,
}: FeedbackModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        role="status"
        className={`bg-surface-container-low border ${borderColor || "border-primary"} p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center`}
      >
        <p className={`text-base font-medium ${textColor || "text-primary"} mb-4`}>
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-2 px-4 ${bgColor || "bg-primary"} hover:${bgColorHover || "bg-primary-hover"} text-white font-medium rounded-xl cursor-pointer transition-colors`}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
