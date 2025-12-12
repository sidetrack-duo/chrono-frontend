import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { signup, sendEmailVerification, verifyEmailCode } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";
import { useToastStore } from "@/stores/toastStore";

export function SignupPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [verificationCodeMessage, setVerificationCodeMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<string | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);

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

  const validateNickname = (name: string): { valid: boolean; message?: string } => {
    if (!name.trim()) {
      return { valid: false, message: "닉네임을 입력해주세요." };
    }
    if (name.length > 20) {
      return { valid: false, message: "닉네임은 20자 이하여야 합니다." };
    }
    return { valid: true };
  };

  const handleSendVerificationCode = async () => {
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }

    setEmailMessage(null);
    setIsSendingCode(true);

    try {
      await sendEmailVerification({ email: email.trim() });
      setEmailMessage("인증코드가 발송되었습니다.");
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

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationCodeMessage("인증코드를 입력해주세요.");
      return;
    }

    setVerificationCodeMessage(null);
    setIsVerifyingCode(true);

    try {
      await verifyEmailCode({ email: email.trim(), code: verificationCode.trim() });
      setEmailVerified(true);
      setVerificationCodeMessage("인증이 완료되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        setVerificationCodeMessage(err.message || "인증코드 확인에 실패했습니다.");
      } else {
        setVerificationCodeMessage("인증코드 확인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailVerified) {
      showToast("이메일 인증을 완료해주세요.", "error");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordMessage(passwordValidation.message || "비밀번호 조건을 만족하지 않습니다.");
      return;
    }
    setPasswordMessage(null);

    if (password !== passwordConfirm) {
      setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPasswordConfirmMessage(null);

    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.valid) {
      setNicknameMessage(nicknameValidation.message || "닉네임 조건을 만족하지 않습니다.");
      return;
    }
    setNicknameMessage(null);

    setIsLoading(true);

    try {
      await signup({ email, password, nickname: nickname.trim() });
      showToast("회원가입이 완료되었습니다.", "success");
      navigate("/login", { state: { message: "회원가입이 완료되었습니다. 로그인해주세요." } });
    } catch (err) {
      if (isApiError(err)) {
        const errorMessage = err.message || "회원가입에 실패했습니다.";
        showToast(errorMessage, "error");
        if (errorMessage.includes("닉네임")) {
          setNicknameMessage("사용 중인 닉네임입니다.");
        }
      } else {
        showToast("회원가입 중 오류가 발생했습니다.", "error");
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
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    {emailMessage && (
                      <span className={`text-xs ${emailMessage.includes("발송되었습니다") ? "text-primary-dark" : "text-accent-dark"}`}>
                        {emailMessage}
                      </span>
                    )}
                  </div>
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
                        setEmailMessage(null);
                        setVerificationCodeMessage(null);
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
                      className="h-10 rounded-l-none whitespace-nowrap px-4 min-w-[100px]"
                    >
                      {emailVerified ? "인증완료" : "인증하기"}
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      인증코드
                    </label>
                    {verificationCodeMessage && (
                      <span className={`text-xs ${verificationCodeMessage.includes("완료") ? "text-primary-dark" : "text-accent-dark"}`}>
                        {verificationCodeMessage}
                      </span>
                    )}
                  </div>
                  <div className="flex">
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="인증코드를 입력하세요"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                        setVerificationCode(value);
                        setVerificationCodeMessage(null);
                      }}
                      maxLength={8}
                      disabled={emailVerified}
                      className="flex-1 rounded-r-none border-r-0"
                      label=""
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={emailVerified || !verificationCode.trim() || isVerifyingCode}
                      isLoading={isVerifyingCode}
                      className="h-10 rounded-l-none whitespace-nowrap px-4 min-w-[100px]"
                    >
                      {emailVerified ? "인증완료" : "인증확인"}
                    </Button>
                  </div>
                </div>

              </div>

              <div className={emailVerified ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      비밀번호
                    </label>
                    {passwordMessage && (
                      <span className="text-xs text-accent-dark">
                        {passwordMessage}
                      </span>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      if (value && !validatePassword(value).valid) {
                        setPasswordMessage(validatePassword(value).message || "비밀번호 조건을 만족하지 않습니다.");
                      } else {
                        setPasswordMessage(null);
                      }
                      if (passwordConfirm && value !== passwordConfirm) {
                        setPasswordConfirmMessage(null);
                      }
                    }}
                    required
                    autoComplete="new-password"
                    label=""
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      비밀번호 확인
                    </label>
                    {passwordConfirmMessage && (
                      <span className="text-xs text-accent-dark">
                        {passwordConfirmMessage}
                      </span>
                    )}
                  </div>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPasswordConfirm(value);
                      if (value && password && value !== password) {
                        setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
                      } else {
                        setPasswordConfirmMessage(null);
                      }
                    }}
                    required
                    autoComplete="new-password"
                    label=""
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      닉네임
                    </label>
                    {nicknameMessage && (
                      <span className="text-xs text-accent-dark">
                        {nicknameMessage}
                      </span>
                    )}
                  </div>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="닉네임을 입력하세요 (최대 20자)"
                    value={nickname}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 20) {
                        setNickname(value);
                        if (value && !validateNickname(value).valid) {
                          setNicknameMessage(validateNickname(value).message || "닉네임 조건을 만족하지 않습니다.");
                        } else {
                          setNicknameMessage(null);
                        }
                      }
                    }}
                    maxLength={20}
                    required
                    autoComplete="nickname"
                    label=""
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
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

