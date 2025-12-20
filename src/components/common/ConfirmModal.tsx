import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export interface ConfirmModalProps {
  /**
   * 모달 열림/닫힘 상태
   */
  isOpen: boolean;
  /**
   * 모달 닫기 핸들러
   */
  onClose: () => void;
  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm: () => void;
  /**
   * 모달 제목
   */
  title: string;
  /**
   * 모달 설명
   */
  description?: string;
  /**
   * 확인 버튼 텍스트 (기본: "확인")
   */
  confirmText?: string;
  /**
   * 취소 버튼 텍스트 (기본: "취소")
   */
  cancelText?: string;
  /**
   * 확인 버튼 variant (기본: "accent")
   */
  confirmVariant?: "primary" | "accent";
  /**
   * 확인 버튼 로딩 상태
   */
  isLoading?: boolean;
  /**
   * 배경 클릭 시 닫기 여부 (기본: true)
   */
  closeOnBackdropClick?: boolean;
  /**
   * 아이콘 표시 여부 (기본: true)
   */
  showIcon?: boolean;
}

/**
 * 확인 모달 컴포넌트
 * 사용자 확인이 필요한 작업에 사용합니다.
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "accent",
  isLoading = false,
  closeOnBackdropClick = true,
  showIcon = true,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && !isLoading && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            {showIcon && (
              <AlertTriangle className="h-5 w-5 shrink-0 text-accent-dark mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h3>
              {description && (
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  {description
                    .replace(/\\n/g, '\n')
                    .split('\n')
                    .map((line, index, array) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant === "accent" ? "accent" : "primary"}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

