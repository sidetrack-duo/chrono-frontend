import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { AlertTriangle } from "lucide-react";

export function AccountDeletionSection() {
  const handleDeleteAccount = () => {
    // TODO: 회원탈퇴 확인 모달 표시
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
          variant="outline"
          size="sm"
          onClick={handleDeleteAccount}
          className="shrink-0 border-accent-dark text-accent-dark"
        >
          탈퇴하기
        </Button>
      </div>
    </Card>
  );
}

