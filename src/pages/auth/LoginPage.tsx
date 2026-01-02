import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/stores/authStore";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const showToast = useToastStore((state) => state.showToast);
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      const from = (location.state as { from?: string })?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "로그인에 실패했습니다.", "error");
      } else {
        showToast("로그인 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link to="/" className="mb-6 flex flex-col items-center gap-3 transition-opacity hover:opacity-80">
            <span className="text-5xl font-extrabold tracking-[-0.015em] text-gray-900">
              chrono<span className="text-primary text-6xl leading-none">.</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            돌아오신 것을 환영합니다!
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-gray-100 shadow-lg shadow-zinc-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                id="email"
                type="email"
                label="이메일"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                id="password"
                type="password"
                label="비밀번호"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full -mt-2"
              isLoading={isLoading}
            >
              로그인
            </Button>

            <div className="text-center -mt-4">
              <Link
                to="/forgot-password"
                className="text-xs uppercase text-gray-500 hover:text-primary"
              >
                비밀번호 찾기
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  아직 계정이 없으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
              >
                회원가입하고 시작하기
              </Link>
            </div>
          </div>
        </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
