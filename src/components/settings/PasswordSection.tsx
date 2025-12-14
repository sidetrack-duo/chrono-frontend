import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useToastStore } from "@/stores/toastStore";

export function PasswordSection() {
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const validatePassword = (pwd: string): { valid: boolean; message?: string } => {
    if (pwd.length < 8) {
      return { valid: false, message: "비밀번호는 8자 이상이어야 합니다." };
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return { valid: false, message: "비밀번호는 영문자를 포함해야 합니다." };
    }
    if (!/\d/.test(pwd)) {
      return { valid: false, message: "비밀번호는 숫자를 포함해야 합니다." };
    }
    if (!/[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?`~]/.test(pwd)) {
      return { valid: false, message: "비밀번호는 특수문자를 포함해야 합니다." };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("모든 필드를 입력해주세요.", "error");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setPasswordMessage(passwordValidation.message || "비밀번호 조건을 만족하지 않습니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPasswordMessage(null);

    setIsLoading(true);

    try {
      // TODO: API 연동 예정
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast("비밀번호가 변경되었습니다.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast("비밀번호 변경에 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="currentPassword"
        type="password"
        label="현재 비밀번호"
        placeholder="현재 비밀번호 입력"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <div className="space-y-1.5 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
          {passwordMessage && (
            <span className="text-xs text-accent-dark">
              {passwordMessage}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Input
            id="newPassword"
            type="password"
            placeholder="새 비밀번호 입력 (영문, 숫자, 특수문자 포함 8자 이상)"
            value={newPassword}
            onChange={(e) => {
              const value = e.target.value;
              setNewPassword(value);
              if (value && !validatePassword(value).valid) {
                setPasswordMessage(validatePassword(value).message || "비밀번호 조건을 만족하지 않습니다.");
              } else {
                setPasswordMessage(null);
              }
              if (confirmPassword && value !== confirmPassword) {
                setPasswordMessage(null);
              }
            }}
            label=""
          />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);
              if (value && newPassword && value !== newPassword) {
                setPasswordMessage("비밀번호가 일치하지 않습니다.");
              } else {
                setPasswordMessage(null);
              }
            }}
            label=""
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
        비밀번호 변경
      </Button>
    </form>
  );
}

