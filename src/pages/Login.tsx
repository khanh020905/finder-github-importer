import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, ArrowRight } from "lucide-react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: just redirect
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="text-primary-foreground max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">Finder</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Kết nối sinh viên,<br />xây dựng tình bạn
          </h2>
          <p className="text-lg opacity-90">
            Nền tảng giúp tân sinh viên FPT University tìm bạn bè, nhóm học tập 
            và tham gia hoạt động campus dễ dàng.
          </p>
          <div className="flex gap-6 pt-4">
            {["Tìm bạn theo sở thích", "Nhóm học tập", "Sự kiện campus"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm opacity-80">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Finder</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignUp
                ? "Bắt đầu hành trình kết nối tại FPT University"
                : "Chào mừng bạn quay lại Finder"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email sinh viên</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@fpt.edu.vn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">
              {isSignUp ? "Đăng ký" : "Đăng nhập"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Đăng nhập" : "Đăng ký ngay"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
