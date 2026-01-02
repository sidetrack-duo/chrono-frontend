import { useState, useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Badge } from "@/components/common/Badge";
import { Project } from "@/types/api";
import { useToastStore } from "@/stores/toastStore";
import { isApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { POPULAR_TECH_STACKS } from "@/lib/constants/techStacks";

export interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSubmit: (data: {
    title: string;
    description?: string;
    techStack?: string;
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

  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getTodayString();

  useEffect(() => {
    if (isOpen && project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setTechStack(project.techStack || "");
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

  const [techStackInput, setTechStackInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const techStackInputRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const techStackArray = useMemo(() => {
    if (!techStack.trim()) return [];
    return techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [techStack]);

  const suggestions = useMemo(() => {
    if (!techStackInput.trim() || !showSuggestions) return [];
    const inputLower = techStackInput.toLowerCase();
    const currentItems = techStackArray.map((s) => s.toLowerCase());
    return POPULAR_TECH_STACKS.filter(
      (tech) =>
        tech.toLowerCase().includes(inputLower) &&
        !currentItems.includes(tech.toLowerCase())
    ).slice(0, 8);
  }, [techStackInput, techStackArray, showSuggestions]);

  const addTechToStack = (tech: string) => {
    if (!tech.trim()) return;
    const trimmedTech = tech.trim();
    if (!techStackArray.map((s) => s.toLowerCase()).includes(trimmedTech.toLowerCase())) {
      const newArray = [...techStackArray, trimmedTech];
      setTechStack(newArray.join(", "));
    }
    setTechStackInput("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleRemoveTech = (indexToRemove: number) => {
    const newArray = techStackArray.filter((_, idx) => idx !== indexToRemove);
    setTechStack(newArray.join(", "));
  };

  const handleTechStackInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechStackInput(value);
    
    const lastCommaIndex = value.lastIndexOf(",");
    if (lastCommaIndex >= 0) {
      const parts = value.split(",").map(s => s.trim()).filter(Boolean);
      const newTechs = parts.slice(0, parts.length - 1);
      newTechs.forEach(tech => addTechToStack(tech));
      setTechStackInput(parts[parts.length - 1] || "");
    }
    
    setShowSuggestions(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (tech: string) => {
    addTechToStack(tech);
  };

  const handleTechStackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (techStackInput.trim()) {
        addTechToStack(techStackInput);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === "Backspace" && !techStackInput && techStackArray.length > 0) {
      handleRemoveTech(techStackArray.length - 1);
    }
  };

  useEffect(() => {
    if (isOpen && project) {
      setTechStackInput("");
    }
  }, [isOpen, project]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        techStackInputRef.current &&
        !techStackInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    let finalTechStack = techStack.trim();
    if (techStackInput.trim()) {
      addTechToStack(techStackInput);
      finalTechStack = techStack.trim();
    }

    if (targetDate && targetDate < today) {
      showToast("목표일은 오늘 이후 날짜만 선택할 수 있습니다.", "error");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim() || undefined;
    const trimmedTechStack = finalTechStack || undefined;
    const finalTargetDate = targetDate || undefined;

    if (
      project &&
      trimmedTitle === project.title &&
      trimmedDescription === (project.description || "") &&
      trimmedTechStack === (project.techStack || "") &&
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
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">프로젝트 수정</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="title"
                type="text"
                label="제목"
                placeholder="프로젝트 제목을 입력해주세요 (최대 50자)"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  if (titleMessage) {
                    const validation = validateTitle(value);
                    if (validation.valid) {
                      setTitleMessage(null);
                    } else {
                      setTitleMessage(validation.message || null);
                    }
                  }
                }}
                required
                disabled={isLoading}
                error={titleMessage ? "" : undefined}
              />
              {titleMessage && (
                <p className="mt-1.5 text-sm text-accent-dark">{titleMessage}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                {descriptionMessage && (
                  <span className="text-xs text-accent-dark">{descriptionMessage}</span>
                )}
              </div>
              <textarea
                id="description"
                rows={4}
                className={`flex w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                  descriptionMessage
                    ? "border-accent focus:border-accent focus:ring-accent"
                    : "border-gray-300 bg-white focus:border-primary focus:ring-primary"
                }`}
                placeholder="프로젝트 설명을 추가할 수 있어요"
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);
                  if (descriptionMessage || value.length > 0) {
                    const validation = validateDescription(value);
                    if (validation.valid) {
                      setDescriptionMessage(null);
                    } else {
                      setDescriptionMessage(validation.message || null);
                    }
                  }
                }}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">{description.length}/1000</p>
            </div>

            <div className="space-y-1.5 w-full">
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                목표
              </label>
              <div className="relative group">
                <input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={today}
                  disabled={isLoading}
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm transition-all duration-200",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                    "date-input-custom",
                    !targetDate ? "text-transparent focus:text-gray-900" : "text-gray-900"
                  )}
                  style={{
                    colorScheme: "light",
                  }}
                />
                {!targetDate && (
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none group-focus-within:hidden">
                    프로젝트 목표일을 설정해보세요
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
                기술 스택
              </label>
              <div className="relative" ref={techStackInputRef}>
                <Input
                  id="techStack"
                  type="text"
                  placeholder="기술 스택을 입력하세요. 쉼표(,) 또는 Enter로 추가됩니다"
                  value={techStackInput}
                  onChange={handleTechStackInputChange}
                  onKeyDown={handleTechStackKeyDown}
                  onFocus={() => {
                    if (techStackInput.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  disabled={isLoading}
                  label=""
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto"
                  >
                    {suggestions.map((tech, idx) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleSelectSuggestion(tech)}
                        disabled={isLoading}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm transition-colors",
                          "hover:bg-gray-50",
                          idx === selectedIndex && "bg-primary-50 text-primary",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {techStackArray.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {techStackArray.map((tech, idx) => (
                    <Badge
                      key={`${tech}-${idx}`}
                      variant="outline"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(idx)}
                        disabled={isLoading}
                        className="ml-0.5 -mr-0.5 rounded-full hover:bg-gray-100 p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`${tech} 제거`}
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full sm:flex-1"
              >
                수정
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

