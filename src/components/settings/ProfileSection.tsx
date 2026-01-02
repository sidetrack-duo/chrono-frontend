import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { updateProfile } from "@/lib/api/user";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";
import { User as UserType } from "@/types/api";

interface ProfileSectionProps {
  user: UserType | null;
  onUpdate: (nickname: string) => void;
}

export function ProfileSection({ user, onUpdate }: ProfileSectionProps) {
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user?.nickname]);

  const validateNickname = (name: string): { valid: boolean; message?: string } => {
    if (!name.trim()) {
      return { valid: false, message: "닉네임을 입력해주세요." };
    }
    if (name.length > 20) {
      return { valid: false, message: "닉네임은 20자 이하여야 합니다." };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNicknameMessage(null);

    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.valid) {
      setNicknameMessage(nicknameValidation.message || "닉네임 조건을 만족하지 않습니다.");
      return;
    }

    if (nickname.trim() === user?.nickname) {
      showToast("변경된 내용이 없습니다.", "info");
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile({ nickname: nickname.trim() });
      onUpdate(nickname.trim());
      showToast("닉네임이 변경되었습니다.", "success");
    } catch (err) {
      if (isApiError(err)) {
        const errorMessage = err.message || "닉네임 변경에 실패했습니다.";
        if (errorMessage.includes("닉네임") || errorMessage.includes("중복")) {
          setNicknameMessage("사용 중인 닉네임입니다.");
        } else {
          showToast(errorMessage, "error");
        }
      } else {
        showToast("닉네임 변경 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input
        id="email"
        type="email"
        label="이메일"
        value={user?.email || ""}
        disabled
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              닉네임
            </label>
            {nicknameMessage && (
              <span className="text-xs text-accent-dark">
                {nicknameMessage}
              </span>
            )}
          </div>
          <Input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요 (최대 20자)"
            value={nickname}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 20) {
                setNickname(value);
                if (value && !validateNickname(value).valid) {
                  setNicknameMessage(validateNickname(value).message || "닉네임 조건을 만족하지 않습니다.");
                } else {
                  setNicknameMessage(null);
                }
              }
            }}
            maxLength={20}
            required
            autoComplete="nickname"
            label=""
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto mb-7">
          닉네임 변경
        </Button>
      </form>
    </>
  );
}

