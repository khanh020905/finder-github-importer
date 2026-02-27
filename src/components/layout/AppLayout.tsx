import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Compass, MessageCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { to: "/swipe", label: "Trang chủ" },
  { to: "/explore", label: "Khám phá" },
  { to: "/matches", label: "Ghép đôi" },
  { to: "/messages", label: "Tin nhắn" },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const loc = useLocation();
  const { user, profile } = useAuth();
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.id || "default"}&backgroundColor=ffd5dc`;

  return (
    <div className="min-h-screen bg-background">
      {/* ══════════ GLOBAL TOP NAVBAR ══════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold tracking-tight">
              <span className="font-serif-display italic text-gradient-flame">
                Fin
              </span>
              <span>der</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => {
              const active = loc.pathname === item.to;

              {
                /* Khám phá with dropdown */
              }
              if (item.to === "/explore") {
                const isExploreActive = [
                  "/explore",
                  "/events",
                  "/study-groups",
                ].includes(loc.pathname);
                return (
                  <div key={item.to} className="relative group">
                    <Link
                      to={item.to}
                      className={`text-sm font-medium transition-colors hover:text-primary py-4 ${
                        isExploreActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                      <svg
                        className="inline-block w-3.5 h-3.5 ml-1 opacity-50 group-hover:opacity-100 transition-all group-hover:rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>

                    {/* Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-elevated border border-border/40 p-2 min-w-[180px] animate-fade-in">
                        <Link
                          to="/explore"
                          className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-primary/5 hover:text-primary ${
                            loc.pathname === "/explore"
                              ? "text-primary bg-primary/5"
                              : "text-foreground"
                          }`}
                        >
                          Tìm bạn đồng hành
                        </Link>
                        <Link
                          to="/events"
                          className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-primary/5 hover:text-primary ${
                            loc.pathname === "/events"
                              ? "text-primary bg-primary/5"
                              : "text-foreground"
                          }`}
                        >
                          Sự kiện
                        </Link>
                        <Link
                          to="/study-groups"
                          className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-primary/5 hover:text-primary ${
                            loc.pathname === "/study-groups"
                              ? "text-primary bg-primary/5"
                              : "text-foreground"
                          }`}
                        >
                          Nhóm học tập
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Profile avatar */}
          <Link
            to="/profile"
            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
              loc.pathname === "/profile"
                ? "border-primary shadow-glow"
                : "border-transparent hover:border-primary/20"
            }`}
          >
            <img
              src={avatarUrl}
              alt=""
              className="w-full h-full object-cover bg-primary/5"
            />
          </Link>
        </div>
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="max-w-5xl mx-auto pt-20 pb-24 md:pb-8 px-4 md:px-6">
        {children}
      </main>

      {/* ══════════ MOBILE BOTTOM NAV ══════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-heavy border-t border-border/30 md:hidden">
        <div className="flex justify-around py-1.5 safe-area-bottom">
          {[
            { to: "/swipe", icon: Heart, label: "Trang chủ" },
            { to: "/explore", icon: Compass, label: "Khám phá" },
            { to: "/matches", icon: Sparkles, label: "Ghép đôi" },
            { to: "/messages", icon: MessageCircle, label: "Tin nhắn" },
          ].map((item) => {
            const active = loc.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`relative transition-transform ${active ? "scale-110" : ""}`}
                >
                  <item.icon
                    className={`w-[22px] h-[22px] ${active ? "drop-shadow-sm" : ""}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {active && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full gradient-hot" />
                  )}
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
