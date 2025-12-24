import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { getRepos } from "@/lib/api/github";
import { createProject } from "@/lib/api/project";
import { getMe } from "@/lib/api/user";
import { isApiError } from "@/lib/api/client";
import { GitHubRepo } from "@/types/api";

export function ProjectCreatePage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoName, setRepoName] = useState("");

  useEffect(() => {
    const loadUserAndRepos = async () => {
      try {
        if (!user?.githubUsername) {
          const userData = await getMe();
          setUser(userData);
          if (!userData.githubUsername) {
            showToast("GitHub Username이 설정되지 않았습니다. 설정 페이지에서 GitHub Username을 설정해주세요.", "error");
            return;
          }
        }

        setIsLoadingRepos(true);
        const repoList = await getRepos();
        setRepos(repoList);
      } catch (err) {
        if (isApiError(err)) {
          if (err.code === "GITHUB_USERNAME_NOT_SET") {
            showToast("GitHub Username이 설정되지 않았습니다. 설정 페이지에서 GitHub Username을 설정해주세요.", "error");
          } else {
            showToast(err.message || "리포지토리 목록을 불러오는데 실패했습니다.", "error");
          }
        } else {
          showToast("리포지토리 목록을 불러오는데 실패했습니다.", "error");
        }
      } finally {
        setIsLoadingRepos(false);
      }
    };

    loadUserAndRepos();
  }, [user, setUser, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("제목을 입력해주세요.", "error");
      return;
    }

    if (!repoName) {
      showToast("GitHub 리포지토리를 선택해주세요.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const githubUsername = user?.githubUsername;
      if (!githubUsername) {
        showToast("GitHub Username이 설정되지 않았습니다.", "error");
        setIsLoading(false);
        return;
      }
      
      await createProject(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          targetDate: targetDate || undefined,
          techStack: techStack.trim() || undefined,
          repoName,
        },
        githubUsername
      );
      showToast("프로젝트가 생성되었습니다.", "success");
      navigate("/projects");
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "프로젝트 생성에 실패했습니다.", "error");
      } else {
        showToast("프로젝트 생성 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const repoOptions = repos.map((repo) => ({
    value: repo.fullName,
    label: repo.fullName,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">새 프로젝트 생성</h1>
        <p className="text-sm text-gray-500">GitHub 리포지토리를 연동하여 프로젝트를 시작하세요.</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="title"
            type="text"
            label="제목"
            placeholder="프로젝트 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="프로젝트에 대한 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              id="targetDate"
              type="date"
              label="목표일"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />

            <Input
              id="techStack"
              type="text"
              label="기술 스택"
              placeholder="예: React, TypeScript, Node.js"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
          </div>

          <Select
            id="repoName"
            label="GitHub 리포지토리"
            options={
              isLoadingRepos
                ? [{ value: "", label: "로딩 중..." }]
                : repoOptions.length > 0
                ? [{ value: "", label: "리포지토리를 선택하세요" }, ...repoOptions]
                : [{ value: "", label: "사용 가능한 리포지토리가 없습니다" }]
            }
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
            disabled={isLoadingRepos || repoOptions.length === 0}
            helperText={
              isLoadingRepos
                ? "리포지토리 목록을 불러오는 중..."
                : repoOptions.length === 0
                ? "GitHub username을 설정하고 public 리포지토리가 있는지 확인해주세요."
                : undefined
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoadingRepos || repoOptions.length === 0}
              className="flex-1"
            >
              생성하기
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
