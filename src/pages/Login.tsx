import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  ArrowRight,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"social" | "email">("social");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email và mật khẩu",
        variant: "destructive",
      });
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }
    if (isSignUp && password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu tối thiểu 6 ký tự",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Đăng ký thất bại",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Đăng ký thành công! 🎉",
            description: "Hãy hoàn tất hồ sơ của bạn.",
          });
          // Auth state change will trigger redirect to /onboarding
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Đăng nhập thất bại",
            description: error.message,
            variant: "destructive",
          });
        }
        // Auth state change will trigger redirect
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero gradient */}
      <div className="relative h-[340px] gradient-romantic flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="absolute w-64 h-64 rounded-full border border-white/20" />
          <div className="absolute w-96 h-96 rounded-full border border-white/10" />
        </div>
        <div className="absolute w-24 h-24 rounded-full bg-white/8 -top-6 -right-6 animate-float" />
        <div
          className="absolute w-16 h-16 rounded-full bg-white/6 top-20 left-8 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-white/5 bottom-24 right-12 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="absolute top-16 left-[20%] opacity-20 animate-float">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>
        <div className="absolute top-32 right-[25%] opacity-15 animate-float-slow">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
        <div className="relative z-10 text-center pb-14 animate-slide-up">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-11 h-11 text-white fill-white" />
          </div>
          <h1
            className="text-4xl font-black text-white tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="font-serif-display italic">Fin</span>der
          </h1>
          <p className="text-white/50 text-[10px] mt-1 uppercase tracking-[0.25em] font-semibold">
            Dating 2026
          </p>
        </div>
      </div>

      {/* Form area */}
      <div
        className="flex-1 -mt-8 rounded-t-[2rem] bg-background relative z-10 px-6 pt-8 pb-6 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="max-w-sm mx-auto">
          {/* Social login (default) */}
          {mode === "social" && (
            <div className="space-y-3 animate-fade-in">
              <h2 className="text-xl font-bold text-center mb-1">
                Đăng nhập ngay
              </h2>
              <p className="text-center text-sm text-muted-foreground mb-5">
                Chọn cách đăng nhập nhanh nhất cho bạn
              </p>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full flex items-center gap-3 h-[52px] px-4 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all active:scale-[0.98] border border-border/50 disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-semibold flex-1">
                  Tiếp tục với Google
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">
                  hoặc
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email button */}
              <button
                onClick={() => setMode("email")}
                className="w-full flex items-center justify-center gap-2 h-[48px] rounded-2xl border border-border hover:bg-muted transition-all text-sm font-semibold active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" /> Đăng nhập bằng Email
              </button>
            </div>
          )}

          {/* Email login */}
          {mode === "email" && (
            <form
              onSubmit={handleEmailAuth}
              className="space-y-4 animate-slide-up"
            >
              <button
                type="button"
                onClick={() => setMode("social")}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
              <h2 className="text-xl font-bold">
                {isSignUp ? "Tạo tài khoản" : "Đăng nhập bằng Email"}
              </h2>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pl-11 h-13 rounded-2xl bg-muted/50 border-0 text-base focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="pl-11 pr-11 h-13 rounded-2xl bg-muted/50 border-0 text-base focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <div className="relative animate-slide-up">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className="pl-11 h-13 rounded-2xl bg-muted/50 border-0 text-base focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}
              {!isSignUp && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 rounded-2xl gradient-hot border-0 text-white font-semibold text-base shadow-elevated hover:shadow-glow transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Đăng ký" : "Đăng nhập"}{" "}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-semibold hover:underline"
                >
                  {isSignUp ? "Đăng nhập" : "Đăng ký ngay"}
                </button>
              </p>
            </form>
          )}

          {/* Verification badge */}
          <div className="flex items-center gap-2.5 mt-6 p-3.5 rounded-2xl gradient-glass border border-primary/8">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Xác minh{" "}
              <span className="text-primary font-semibold">Photo Verified</span>{" "}
              để tăng 30% matches và giảm fake.
            </p>
          </div>

          {/* Terms */}
          <p className="text-[10px] text-muted-foreground/60 text-center mt-4 leading-relaxed">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <span className="underline">Điều khoản</span> và{" "}
            <span className="underline">Chính sách bảo mật</span> của Finder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
