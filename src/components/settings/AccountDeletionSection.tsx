import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { AlertTriangle } from "lucide-react";
import { deleteAccount } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

export function AccountDeletionSection() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.showToast);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteAccountClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      showToast("회원 탈퇴가 완료되었습니다.", "success");
      await logout();
      navigate("/");
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "회원 탈퇴에 실패했습니다.", "error");
      } else {
        showToast("회원 탈퇴 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Card className="border-0 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">회원 탈퇴</h2>

      <div className="flex items-center justify-between gap-4">
        <p className="flex items-start gap-1 text-sm text-accent-dark">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
          <span>
            <strong>주의:</strong> 회원 탈퇴 후에는 프로젝트 기록 및 데이터를 복구할 수 없습니다. 그래도 탈퇴하시겠습니까?
          </span>
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={handleDeleteAccountClick}
          disabled={isDeleting}
          isLoading={isDeleting}
          className="shrink-0"
        >
          탈퇴하기
        </Button>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
        title="회원 탈퇴"
        description="탈퇴 시 회원님의 기록 및 데이터를 복구할 수 없습니다.\n정말로 탈퇴하시겠습니까?"
        confirmText="탈퇴"
        cancelText="취소"
        confirmVariant="accent"
        isLoading={isDeleting}
      />
    </Card>
  );
}

