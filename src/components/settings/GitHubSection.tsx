import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { updateGithubUsername } from "@/lib/api/user";
import { connectGitHubPat, disconnectGitHubPat, validateGitHubUsername } from "@/lib/api/github";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";
import { Github, ExternalLink, HelpCircle, ShieldCheck } from "lucide-react";

interface GitHubSectionProps {
  initialUsername: string;
  onUpdate: (username: string) => void;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

interface ValidationState {
  status: ValidationStatus;
  message: string | null;
}

export function GitHubSection({ initialUsername, onUpdate }: GitHubSectionProps) {
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState(initialUsername);
  const [githubUsernameValidation, setGithubUsernameValidation] = useState<ValidationState>({
    status: 'idle',
    message: null,
  });
  
  const [isPatLoading, setIsPatLoading] = useState(false);
  const [patUsername, setPatUsername] = useState(initialUsername);
  const [patUsernameValidation, setPatUsernameValidation] = useState<ValidationState>({
    status: 'idle',
    message: null,
  });
  const [patToken, setPatToken] = useState("");
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  const githubUsernameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const patUsernameTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateUsername = useCallback(async (username: string, setValidation: (state: ValidationState) => void) => {
    if (!username.trim()) {
      setValidation({ status: 'idle', message: null });
      return;
    }

    if (username.trim() === initialUsername) {
      setValidation({ status: 'idle', message: null });
      return;
    }

    setValidation({ status: 'validating', message: '...' });

    try {
      const result = await validateGitHubUsername(username.trim());
      if (result.valid) {
        setValidation({
          status: 'valid',
          message: '사용 가능한 GitHub Username',
        });
      } else {
        const errorMessage = result.message || '존재하지 않는 GitHub Username';
        setValidation({
          status: 'invalid',
          message: errorMessage.includes('사용자') || errorMessage.includes('사용자를 찾을 수 없습니다') || errorMessage.includes('존재하지 않는')
            ? '존재하지 않는 GitHub Username'
            : errorMessage,
        });
      }
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === 'GITHUB_RATE_LIMIT') {
          setValidation({
            status: 'invalid',
            message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요',
          });
        } else {
          setValidation({
            status: 'invalid',
            message: err.message || '검증 중 오류가 발생했습니다',
          });
        }
      } else {
        setValidation({
          status: 'invalid',
          message: '검증 중 오류가 발생했습니다',
        });
      }
    }
  }, [initialUsername]);

  useEffect(() => {
    if (githubUsernameTimeoutRef.current) {
      clearTimeout(githubUsernameTimeoutRef.current);
    }

    githubUsernameTimeoutRef.current = setTimeout(() => {
      validateUsername(githubUsername, setGithubUsernameValidation);
    }, 500);

    return () => {
      if (githubUsernameTimeoutRef.current) {
        clearTimeout(githubUsernameTimeoutRef.current);
      }
    };
  }, [githubUsername, validateUsername]);

  useEffect(() => {
    if (patUsernameTimeoutRef.current) {
      clearTimeout(patUsernameTimeoutRef.current);
    }

    patUsernameTimeoutRef.current = setTimeout(() => {
      validateUsername(patUsername, setPatUsernameValidation);
    }, 500);

    return () => {
      if (patUsernameTimeoutRef.current) {
        clearTimeout(patUsernameTimeoutRef.current);
      }
    };
  }, [patUsername, validateUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!githubUsername.trim()) {
      showToast("GitHub Username을 입력해주세요.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const updated = await updateGithubUsername({ githubUsername: githubUsername.trim() });
      onUpdate(updated.githubUsername);
      showToast("GitHub Username이 업데이트되었습니다.", "success");
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === "GITHUB_USER_NOT_FOUND") {
          showToast("존재하지 않는 GitHub Username입니다.", "error");
        } else {
          showToast(err.message || "GitHub Username 업데이트에 실패했습니다.", "error");
        }
      } else {
        showToast("GitHub Username 업데이트 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patUsername.trim() || !patToken.trim()) {
      showToast("GitHub Username과 PAT를 모두 입력해주세요.", "error");
      return;
    }

    setIsPatLoading(true);

    try {
      await connectGitHubPat({
        username: patUsername.trim(),
        pat: patToken.trim(),
      });
      onUpdate(patUsername.trim());
      showToast("Private repository 분석이 활성화되었습니다.", "success");
      setPatToken("");
    } catch (err) {
      if (isApiError(err)) {
        const errorMessage = err.message || "PAT 연동에 실패했습니다.";
        if (errorMessage.includes("401") || errorMessage.includes("Unauthorized") || errorMessage.includes("인증")) {
          showToast("이 토큰에는 private repository 접근 권한이 없습니다. `repo` 권한이 필요합니다.", "error");
        } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
          showToast("존재하지 않는 GitHub Username입니다.", "error");
        } else {
          showToast(errorMessage, "error");
        }
      } else {
        showToast("PAT 연동 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsPatLoading(false);
    }
  };

  const handleDisconnectPatClick = () => {
    setIsDisconnectModalOpen(true);
  };

  const handleDisconnectPatConfirm = async () => {
    setIsDisconnecting(true);

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
      setIsDisconnectModalOpen(false);
    }
  };

  return (
    <Card className="border-0 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-5">
        <Github className="h-10 w-10 text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">GitHub 연동</h2>
          <p className="text-sm text-gray-500">
            GitHub Username을 등록하여 프로젝트 리포지토리를 연동해보세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700">
              GitHub Username
            </label>
            {githubUsernameValidation.message && (
              <span
                className={`text-xs ${
                  githubUsernameValidation.status === 'valid'
                    ? 'text-primary-dark'
                    : githubUsernameValidation.status === 'invalid'
                    ? 'text-accent-dark'
                    : 'text-gray-500'
                }`}
              >
                {githubUsernameValidation.message}
              </span>
            )}
          </div>
          <Input
            id="githubUsername"
            type="text"
            placeholder="예: octocat"
            value={githubUsername}
            onChange={(e) => {
              setGithubUsername(e.target.value);
              setGithubUsernameValidation({ status: 'idle', message: null });
            }}
            required
            label=""
            error={githubUsernameValidation.status === 'invalid' ? '' : undefined}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="-mt-2 w-full md:w-auto">
          GitHub 연동
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="patUsername" className="block text-sm font-medium text-gray-700">
                GitHub Username
              </label>
              {patUsernameValidation.message && (
                <span
                  className={`text-xs ${
                    patUsernameValidation.status === 'valid'
                      ? 'text-primary-dark'
                      : patUsernameValidation.status === 'invalid'
                      ? 'text-accent-dark'
                      : 'text-gray-500'
                  }`}
                >
                  {patUsernameValidation.message}
                </span>
              )}
            </div>
            <Input
              id="patUsername"
              type="text"
              placeholder="예: octocat"
              value={patUsername}
              onChange={(e) => {
                setPatUsername(e.target.value);
                setPatUsernameValidation({ status: 'idle', message: null });
              }}
              required
              label=""
              error={patUsernameValidation.status === 'invalid' ? '' : undefined}
            />
          </div>

          <Input
            id="patToken"
            type="password"
            label="Personal Access Token(PAT)"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={patToken}
            onChange={(e) => setPatToken(e.target.value)}
            required
          />

          <div className="flex items-center gap-2">
            <Button type="submit" isLoading={isPatLoading} className="w-full md:w-auto">
              PAT 연동
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDisconnectPatClick}
              disabled={isDisconnecting || isPatLoading}
              isLoading={isDisconnecting}
              className="w-full md:w-auto"
            >
              PAT 해제
            </Button>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-start gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">
                PAT은 암호화되어 저장되며, 언제든지 삭제할 수 있습니다.
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">PAT 생성 가이드:</span>
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark underline"
              >
                GitHub Settings
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        onConfirm={handleDisconnectPatConfirm}
        title="PAT 연동 해제"
        description="PAT 연동을 해제하시겠습니까?\n해제 후엔 private repository 접근이 불가합니다."
        confirmText="해제"
        cancelText="취소"
        confirmVariant="accent"
        isLoading={isDisconnecting}
      />
    </Card>
  );
}

