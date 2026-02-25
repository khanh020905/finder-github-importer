import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, CalendarDays, MessageCircle, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Trang chủ" },
  { to: "/find-friends", icon: Users, label: "Tìm bạn" },
  { to: "/study-groups", icon: BookOpen, label: "Nhóm học" },
  { to: "/events", icon: CalendarDays, label: "Sự kiện" },
  { to: "/messages", icon: MessageCircle, label: "Tin nhắn" },
];

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Finder</span>
        </div>
        <Link to="/profile" className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          A
        </Link>
      </header>

      {/* Main content */}
      <main className="container max-w-3xl py-4 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t md:hidden">
        <div className="flex justify-around py-1.5">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side nav (desktop) */}
      <nav className="hidden md:flex fixed top-14 left-0 bottom-0 w-52 bg-card border-r flex-col p-3 gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-auto">
          <Link
            to="/profile"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <User className="w-4 h-4" />
            Hồ sơ
          </Link>
        </div>
      </nav>

      {/* Desktop content offset */}
      <style>{`
        @media (min-width: 768px) {
          main { margin-left: 13rem; }
        }
      `}</style>
    </div>
  );
};
