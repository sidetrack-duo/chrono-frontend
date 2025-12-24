import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { Footer } from "@/components/layout/Footer";
import { requestPasswordReset, resetPassword } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }

    setEmailMessage(null);
    setIsSendingCode(true);

    try {
      await requestPasswordReset({ email: email.trim() });
      setEmailMessage("인증코드가 발송되었습니다.");
      setStep(2);
    } catch (err) {
      if (isApiError(err)) {
        setEmailMessage(err.message || "인증코드 발송에 실패했습니다.");
      } else {
        setEmailMessage("인증코드 발송 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeMessage(null);
    setPasswordMessage(null);

    if (!code.trim()) {
      setCodeMessage("인증코드를 입력해주세요.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setPasswordMessage("비밀번호를 모두 입력해주세요.");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setPasswordMessage(passwordValidation.message || "비밀번호 조건을 만족하지 않습니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsResetting(true);

    try {
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword: newPassword,
      });
      showToast("비밀번호가 재설정되었습니다.", "success");
      navigate("/login");
    } catch (err) {
      if (isApiError(err)) {
        const errorMessage = err.message || "비밀번호 재설정에 실패했습니다.";
        if (errorMessage.includes("인증 코드") || errorMessage.includes("코드")) {
          setCodeMessage(errorMessage);
        } else if (errorMessage.includes("이메일")) {
          setEmailMessage(errorMessage);
        } else {
          setPasswordMessage(errorMessage);
        }
      } else {
        setPasswordMessage("비밀번호 재설정 중 오류가 발생했습니다.");
      }
    } finally {
      setIsResetting(false);
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
              {step === 1 ? "비밀번호를 재설정하기 위해 이메일을 입력해주세요." : "인증코드를 확인하고 새 비밀번호를 입력해주세요."}
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-gray-100 shadow-lg shadow-zinc-100/50">
            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        이메일
                      </label>
                      {emailMessage && (
                        <span className={`text-xs ${emailMessage.includes("발송되었습니다") ? "text-primary-dark" : "text-accent-dark"}`}>
                          {emailMessage}
                        </span>
                      )}
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailMessage(null);
                      }}
                      required
                      label=""
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSendingCode}
                >
                  인증코드 발송
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        인증코드
                      </label>
                      {codeMessage && (
                        <span className="text-xs text-accent-dark">
                          {codeMessage}
                        </span>
                      )}
                    </div>
                    <Input
                      id="code"
                      type="text"
                      placeholder="인증코드를 입력하세요"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setCodeMessage(null);
                      }}
                      required
                      label=""
                      autoComplete="one-time-code"
                    />
                  </div>

                  <div className="space-y-1.5 mb-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                      {passwordMessage && (
                        <span className="text-xs text-accent-dark">
                          {passwordMessage}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="새 비밀번호 입력 (영문, 숫자, 특수문자 포함 8자 이상)"
                        value={newPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewPassword(value);
                          
                          const passwordValidation = validatePassword(value);
                          if (value && !passwordValidation.valid) {
                            setPasswordMessage(passwordValidation.message || "비밀번호 조건을 만족하지 않습니다.");
                          } else if (value && confirmPassword && value !== confirmPassword) {
                            setPasswordMessage("비밀번호가 일치하지 않습니다.");
                          } else if (value && confirmPassword && value === confirmPassword) {
                            setPasswordMessage(null);
                          } else {
                            setPasswordMessage(null);
                          }
                        }}
                        label=""
                        autoComplete="new-password"
                      />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setConfirmPassword(value);
                          
                          if (value && newPassword) {
                            if (value !== newPassword) {
                              setPasswordMessage("비밀번호가 일치하지 않습니다.");
                            } else {
                              const passwordValidation = validatePassword(newPassword);
                              if (!passwordValidation.valid) {
                                setPasswordMessage(passwordValidation.message || "비밀번호 조건을 만족하지 않습니다.");
                              } else {
                                setPasswordMessage(null);
                              }
                            }
                          } else {
                            setPasswordMessage(null);
                          }
                        }}
                        label=""
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isResetting}
                >
                  비밀번호 재설정
                </Button>

                <div className="text-center -mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setCode("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setCodeMessage(null);
                      setPasswordMessage(null);
                    }}
                    className="text-xs uppercase text-gray-500 hover:text-primary"
                  >
                    이메일 다시 입력
                  </button>
                </div>
              </form>
            )}

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
      <Footer />
    </div>
  );
}

