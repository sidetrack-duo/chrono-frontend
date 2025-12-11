import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { signup, sendEmailVerification, verifyEmailCode } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";

export function SignupPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSendVerificationCode = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSendingCode(true);

    try {
      await sendEmailVerification({ email: email.trim() });
      setSuccess("인증코드가 발송되었습니다. 이메일을 확인해주세요.");
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "인증코드 발송에 실패했습니다.");
      } else {
        setError("인증코드 발송 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError("인증코드를 입력해주세요.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsVerifyingCode(true);

    try {
      await verifyEmailCode({ email: email.trim(), code: verificationCode.trim() });
      setEmailVerified(true);
      setSuccess("이메일 인증이 완료되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "인증코드 확인에 실패했습니다.");
      } else {
        setError("인증코드 확인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || "비밀번호 조건을 만족하지 않습니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await signup({ email, password, nickname });
      navigate("/login", { state: { message: "회원가입이 완료되었습니다. 로그인해주세요." } });
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "회원가입에 실패했습니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link to="/" className="mb-6 flex flex-col items-center gap-3 transition-opacity hover:opacity-80">
            <span className="text-5xl font-extrabold tracking-[-0.015em] text-gray-900">
              chrono<span className="text-primary text-6xl leading-none">.</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            이메일로 간편하게 시작하세요!
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-gray-100 shadow-lg shadow-zinc-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일
                  </label>
                  <div className="flex">
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailVerified(false);
                        setVerificationCode("");
                      }}
                      disabled={emailVerified}
                      required
                      autoComplete="email"
                      className="flex-1 rounded-r-none border-r-0"
                      label=""
                    />
                    <Button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={emailVerified || isSendingCode}
                      isLoading={isSendingCode}
                      className="h-10 rounded-l-none whitespace-nowrap px-4"
                    >
                      {emailVerified ? "인증완료" : "인증하기"}
                    </Button>
                  </div>
                </div>

                {!emailVerified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      인증코드
                    </label>
                    <div className="flex">
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="인증코드를 입력하세요"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={8}
                        className="flex-1 rounded-r-none border-r-0"
                        label=""
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={!verificationCode.trim() || isVerifyingCode}
                        isLoading={isVerifyingCode}
                        className="h-10 rounded-l-none whitespace-nowrap px-4"
                      >
                        인증확인
                      </Button>
                    </div>
                  </div>
                )}

                {emailVerified && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    이메일 인증이 완료되었습니다.
                  </div>
                )}
              </div>

              <div className={emailVerified ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
                <div>
                  <Input
                    id="password"
                    type="password"
                    label="비밀번호"
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    error={password && !validatePassword(password).valid ? validatePassword(password).message : undefined}
                    helperText={!password ? "영문, 숫자, 특수문자를 포함하여 8자 이상 입력하세요" : undefined}
                  />
                </div>
                <div>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    label="비밀번호 확인"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    error={passwordConfirm && password !== passwordConfirm ? "비밀번호가 일치하지 않습니다." : undefined}
                  />
                </div>
                <Input
                  id="nickname"
                  type="text"
                  label="닉네임"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  autoComplete="nickname"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              isLoading={isLoading}
              disabled={!emailVerified}
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

