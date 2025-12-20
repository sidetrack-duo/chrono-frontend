import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { updateGithubUsername } from "@/lib/api/user";
import { connectGitHubPat, disconnectGitHubPat } from "@/lib/api/github";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";
import { Github, ExternalLink, HelpCircle } from "lucide-react";

interface GitHubSectionProps {
  initialUsername: string;
  onUpdate: (username: string) => void;
}

export function GitHubSection({ initialUsername, onUpdate }: GitHubSectionProps) {
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState(initialUsername);
  
  const [isPatLoading, setIsPatLoading] = useState(false);
  const [patError, setPatError] = useState<string | null>(null);
  const [patSuccess, setPatSuccess] = useState<string | null>(null);
  const [patUsername, setPatUsername] = useState(initialUsername);
  const [patToken, setPatToken] = useState("");
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!githubUsername.trim()) {
      setError("GitHub username을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const updated = await updateGithubUsername({ githubUsername: githubUsername.trim() });
      onUpdate(updated.githubUsername);
      setSuccess("GitHub username이 업데이트되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === "GITHUB_USER_NOT_FOUND") {
          setError("해당 GitHub 사용자를 찾을 수 없습니다. 올바른 username을 입력해주세요.");
        } else {
          setError(err.message || "GitHub username 업데이트에 실패했습니다.");
        }
      } else {
        setError("GitHub username 업데이트 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatError(null);
    setPatSuccess(null);

    if (!patUsername.trim() || !patToken.trim()) {
      setPatError("GitHub username과 PAT를 모두 입력해주세요.");
      return;
    }

    setIsPatLoading(true);

    try {
      const response = await connectGitHubPat({
        username: patUsername.trim(),
        pat: patToken.trim(),
      });
      onUpdate(patUsername.trim());
      setPatSuccess(response.message || "PAT 연동이 완료되었습니다.");
      setPatToken("");
    } catch (err) {
      if (isApiError(err)) {
        setPatError(err.message || "PAT 연동에 실패했습니다.");
      } else {
        setPatError("PAT 연동 중 오류가 발생했습니다.");
      }
    } finally {
      setIsPatLoading(false);
    }
  };

  const handleDisconnectPat = async () => {
    if (!window.confirm("PAT 연동을 해제하시겠습니까?\n\n해제 후 Private repository 접근이 불가능합니다.")) {
      return;
    }

    setIsDisconnecting(true);
    setPatError(null);
    setPatSuccess(null);

    try {
      const response = await disconnectGitHubPat();
      showToast(response.message || "PAT 연동이 해제되었습니다.", "success");
      setPatToken("");
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "PAT 연동 해제에 실패했습니다.", "error");
      } else {
        showToast("PAT 연동 해제 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card className="border-0 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-5">
        <Github className="h-10 w-10 text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">GitHub 연동</h2>
          <p className="text-sm text-gray-500">
            GitHub username을 설정하여 리포지토리를 연동하세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="githubUsername"
          type="text"
          label="GitHub Username"
          placeholder="예: octocat"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          required
          helperText="프로젝트 생성을 위해 반드시 설정해야 합니다."
        />

        <Button type="submit" isLoading={isLoading} className="-mt-2 w-full md:w-auto">
          GitHub 연동 저장
        </Button>
      </form>

      <div className="mt-8 rounded-lg bg-zinc-50 p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
            <span>PAT 연동 (선택)</span>
            <span
              className="group relative inline-flex cursor-help"
              title="PAT은 GitHub에서 발급하는 개인 인증 토큰이며, private repository 접근에만 사용됩니다."
            >
              <HelpCircle className="h-4 w-4 text-gray-400 transition-colors hover:text-gray-600" />
              <span className="absolute left-1/2 top-full z-10 mt-2 hidden w-64 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                PAT은 GitHub에서 발급하는 개인 인증 토큰이며, private repository 접근에만 사용됩니다.
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></span>
              </span>
            </span>
          </h3>
          <p className="text-sm text-gray-500">
            Personal Access Token(PAT)을 등록하면 private repository까지 분석할 수 있어요.
          </p>
        </div>

        <form onSubmit={handlePatSubmit} className="space-y-5">
          {patSuccess && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {patSuccess}
            </div>
          )}
          {patError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {patError}
            </div>
          )}

          <Input
            id="patUsername"
            type="text"
            label="GitHub Username"
            placeholder="예: octocat"
            value={patUsername}
            onChange={(e) => setPatUsername(e.target.value)}
            required
          />

          <Input
            id="patToken"
            type="password"
            label="Personal Access Token"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={patToken}
            onChange={(e) => setPatToken(e.target.value)}
            required
            helperText={
              <span className="flex items-center gap-1">
                <span>PAT 생성 가이드:</span>
                <a
                  href="https://github.com/settings/tokens?type=beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-dark underline"
                >
                  GitHub Settings
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            }
          />

          <div className="flex items-center gap-2">
            <Button type="submit" isLoading={isPatLoading} className="w-full md:w-auto">
              PAT 연동
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDisconnectPat}
              disabled={isDisconnecting || isPatLoading}
              isLoading={isDisconnecting}
              className="w-full md:w-auto"
            >
              PAT 해제
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

