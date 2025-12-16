import * as React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  /**
   * 아이콘 컴포넌트 (lucide-react)
   */
  icon?: LucideIcon;
  /**
   * 제목
   */
  title: string;
  /**
   * 설명
   */
  description?: string;
  /**
   * 액션 버튼 텍스트
   */
  actionLabel?: string;
  /**
   * 액션 버튼 클릭 핸들러 (Link 사용 시 무시됨)
   */
  onAction?: () => void;
  /**
   * 액션 버튼 링크 (onAction보다 우선)
   */
  actionLink?: string;
  /**
   * 커스텀 클래스명
   */
  className?: string;
  /**
   * 아이콘 배경색 (기본: "bg-gray-100")
   */
  iconBg?: string;
  /**
   * 아이콘 색상 (기본: "text-gray-400")
   */
  iconColor?: string;
}

/**
 * 빈 상태를 표시하는 컴포넌트
 * 데이터가 없을 때 사용자에게 안내를 제공합니다.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon: Icon,
      title,
      description,
      actionLabel,
      onAction,
      actionLink,
      className,
      iconBg = "bg-gray-100",
      iconColor = "text-gray-400",
      ...props
    },
    ref
  ) => {
    const iconSize = "h-8 w-8";

    const actionButton = actionLabel && (
      <div className="mt-6">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            {actionLabel}
          </Link>
        ) : onAction ? (
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm",
          className
        )}
        {...props}
      >
        {Icon && (
          <div className={cn("rounded-full p-4", iconBg)}>
            <Icon className={cn(iconSize, iconColor)} />
          </div>
        )}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
        {actionButton}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

