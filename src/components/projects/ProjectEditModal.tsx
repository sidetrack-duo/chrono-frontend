import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Project } from "@/types/api";
import { useToastStore } from "@/stores/toastStore";
import { isApiError } from "@/lib/api/client";

export interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSubmit: (data: {
    title: string;
    description?: string;
    techStack?: string;
    startDate?: string;
    targetDate?: string;
  }) => Promise<void>;
}

export function ProjectEditModal({
  isOpen,
  onClose,
  project,
  onSubmit,
}: ProjectEditModalProps) {
  const showToast = useToastStore((state) => state.showToast);
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [descriptionMessage, setDescriptionMessage] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (isOpen && project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setTechStack(project.techStack || "");
      setStartDate(project.startDate || "");
      setTargetDate(project.targetDate || "");
      setTitleMessage(null);
      setDescriptionMessage(null);
    }
  }, [isOpen, project]);

  const validateTitle = (value: string): { valid: boolean; message?: string } => {
    if (!value.trim()) {
      return { valid: false, message: "제목을 입력해주세요." };
    }
    if (value.trim().length > 50) {
      return { valid: false, message: "제목은 50자 이하여야 합니다." };
    }
    return { valid: true };
  };

  const validateDescription = (value: string): { valid: boolean; message?: string } => {
    if (value.length > 1000) {
      return { valid: false, message: "설명은 1000자 이하여야 합니다." };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleMessage(null);
    setDescriptionMessage(null);

    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      setTitleMessage(titleValidation.message || "제목 조건을 만족하지 않습니다.");
      return;
    }

    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.valid) {
      setDescriptionMessage(descriptionValidation.message || "설명 조건을 만족하지 않습니다.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim() || undefined;
    const trimmedTechStack = techStack.trim() || undefined;
    const finalStartDate = startDate || undefined;
    const finalTargetDate = targetDate || undefined;

    if (
      project &&
      trimmedTitle === project.title &&
      trimmedDescription === (project.description || "") &&
      trimmedTechStack === (project.techStack || "") &&
      finalStartDate === (project.startDate || "") &&
      finalTargetDate === (project.targetDate || "")
    ) {
      showToast("변경된 내용이 없습니다.", "info");
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: trimmedDescription,
        techStack: trimmedTechStack,
        startDate: finalStartDate,
        targetDate: finalTargetDate,
      });
      showToast("프로젝트가 수정되었습니다.", "success");
      onClose();
    } catch (err) {
      if (isApiError(err)) {
        const errorMessage = err.message;
        if (errorMessage.includes("제목") || errorMessage.includes("title")) {
          setTitleMessage(errorMessage);
        } else if (errorMessage.includes("설명") || errorMessage.includes("description")) {
          setDescriptionMessage(errorMessage);
        } else {
          showToast(errorMessage, "error");
        }
      } else {
        showToast("프로젝트 수정에 실패했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoading && e.target === e.currentTarget) {
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
        className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">프로젝트 수정</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer rounded-lg p-2 text-gray-700 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="title"
                type="text"
                label="제목"
                placeholder="프로젝트 제목을 입력하세요"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleMessage) {
                    const validation = validateTitle(e.target.value);
                    if (validation.valid) {
                      setTitleMessage(null);
                    } else {
                      setTitleMessage(validation.message || null);
                    }
                  }
                }}
                required
                disabled={isLoading}
              />
              {titleMessage && (
                <p className="mt-1.5 text-sm text-red-600">{titleMessage}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="프로젝트에 대한 설명을 입력하세요"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (descriptionMessage) {
                    const validation = validateDescription(e.target.value);
                    if (validation.valid) {
                      setDescriptionMessage(null);
                    } else {
                      setDescriptionMessage(validation.message || null);
                    }
                  }
                }}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between">
                {descriptionMessage && (
                  <p className="text-sm text-red-600">{descriptionMessage}</p>
                )}
                <p className={`ml-auto text-xs ${description.length > 1000 ? "text-red-600" : "text-gray-500"}`}>
                  {description.length}/1000
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                id="startDate"
                type="date"
                label="시작일"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
              />

              <Input
                id="targetDate"
                type="date"
                label="목표일"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Input
              id="techStack"
              type="text"
              label="기술 스택"
              placeholder="예: React, TypeScript, Node.js"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                수정하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

