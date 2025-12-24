import { useEffect } from "react";
import { Card } from "@/components/common/Card";
import { useAuthStore } from "@/stores/authStore";
import { getMe } from "@/lib/api/user";
import { User } from "lucide-react";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PasswordSection } from "@/components/settings/PasswordSection";
import { GitHubSection } from "@/components/settings/GitHubSection";
import { AccountDeletionSection } from "@/components/settings/AccountDeletionSection";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (err) {
        if (isApiError(err)) {
          showToast(err.message || "사용자 정보를 불러오는데 실패했습니다.", "error");
        } else {
          showToast("사용자 정보를 불러오는데 실패했습니다.", "error");
        }
      }
    };

    if (!user) {
      loadUser();
    }
  }, [user, setUser]);

  const handleProfileUpdate = (nickname: string) => {
    if (user) {
      setUser({ ...user, nickname });
    }
  };

  const handleGithubUpdate = (githubUsername: string) => {
    if (user) {
      setUser({ ...user, githubUsername });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">계정설정</h1>
        <p className="mt-1 text-sm text-gray-500">계정 정보와 GitHub 연동을 관리하세요.</p>
      </div>

      {/* 그리드 레이아웃: 내 정보 관리 + GitHub 연동 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 내 정보 관리 (프로필 + 비밀번호) */}
        <Card className="border-0 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-5">
            <User className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">계정 정보</h2>
              <p className="text-sm text-gray-500">이메일, 닉네임, 비밀번호를 관리합니다.</p>
            </div>
          </div>

          <div className="space-y-5">
            <ProfileSection user={user} onUpdate={handleProfileUpdate} />
            <PasswordSection />
          </div>
        </Card>

        {/* GitHub 연동 */}
        <GitHubSection
          initialUsername={user?.githubUsername || ""}
          onUpdate={handleGithubUpdate}
        />
      </div>

      {/* 회원 탈퇴 */}
      <AccountDeletionSection />
    </div>
  );
}
