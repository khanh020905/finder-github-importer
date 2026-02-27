import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Compass, MessageCircle, User, Sparkles } from "lucide-react";

const nav = [
  { to: "/", icon: Heart, label: "Swipe" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/matches", icon: Sparkles, label: "Matches" },
  { to: "/messages", icon: MessageCircle, label: "Chat" },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-40 glass border-b border-border/40 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hot flex items-center justify-center shadow-card">
            <Heart className="w-[18px] h-[18px] text-white fill-white" />
          </div>
          <span className="font-black text-[17px] tracking-tight">
            <span className="font-serif-display italic text-gradient-flame">Campus</span>
            <span>Connect</span>
          </span>
        </div>
        <Link
          to="/profile"
          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
            loc.pathname === "/profile" ? "border-primary shadow-glow" : "border-transparent hover:border-primary/20"
          }`}
        >
          <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=minh-anh&backgroundColor=ffd5dc" alt="" className="w-full h-full object-cover bg-primary/5" />
        </Link>
      </header>

      <main className="container max-w-md py-4 pb-24 md:pb-6 px-4">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-heavy border-t border-border/30 md:hidden">
        <div className="flex justify-around py-1.5 safe-area-bottom">
          {nav.map((item) => {
            const active = loc.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${active ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`relative transition-transform ${active ? "scale-110" : ""}`}>
                  <item.icon className={`w-[22px] h-[22px] ${active ? "drop-shadow-sm" : ""}`} strokeWidth={active ? 2.5 : 2} />
                  {active && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full gradient-hot" />}
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop side nav */}
      <nav className="hidden md:flex fixed top-14 left-0 bottom-0 w-56 bg-card/60 backdrop-blur-xl border-r border-border/30 flex-col p-3 gap-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 pt-3 mb-3">Menu</p>
        {nav.map((item) => {
          const active = loc.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "gradient-hot text-white shadow-card" : "text-muted-foreground hover:bg-muted/50"}`}>
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
              {item.to === "/messages" && <span className="ml-auto w-5 h-5 rounded-full gradient-hot text-white text-[10px] font-bold flex items-center justify-center">3</span>}
            </Link>
          );
        })}
        <div className="mt-auto">
          <Link to="/profile" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${loc.pathname === "/profile" ? "gradient-hot text-white shadow-card" : "text-muted-foreground hover:bg-muted/50"}`}>
            <User className="w-[18px] h-[18px]" /> Profile
          </Link>
        </div>
      </nav>

      <style>{`@media (min-width: 768px) { main { margin-left: 14rem; } }`}</style>
    </div>
  );
};
