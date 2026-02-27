import { mockUsers, mockMatches } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Star, Clock, Verified, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const me = mockUsers[0];

const Matches = () => {
  const matched = mockMatches
    .filter((m) => m.userId1 === me.id || m.userId2 === me.id)
    .map((m) => ({ ...m, user: mockUsers.find((u) => u.id === (m.userId1 === me.id ? m.userId2 : m.userId1))! }))
    .filter((m) => m.user);

  const fmt = (ts: string) => {
    const h = Math.floor((Date.now() - new Date(ts).getTime()) / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" /> Matches
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{matched.length} matches</p>
      </div>

      {/* New matches carousel */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> New Matches
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {matched.map(({ user }) => (
            <Link key={user.id} to="/messages" className="flex flex-col items-center gap-1.5 shrink-0 group">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full p-[2.5px] gradient-hot group-hover:shadow-glow transition-shadow">
                  <div className="w-full h-full rounded-full overflow-hidden bg-card">
                    <img src={user.avatar} alt="" className="w-full h-full object-cover bg-primary/5" />
                  </div>
                </div>
                {user.isOnline && <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-400 border-[2.5px] border-card" />}
              </div>
              <span className="text-xs font-medium max-w-[72px] truncate">{user.name.split(" ").pop()}</span>
            </Link>
          ))}
          <Link to="/" className="flex flex-col items-center gap-1.5 shrink-0 group">
            <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-muted-foreground/15 flex items-center justify-center group-hover:border-primary/30 transition-colors">
              <Heart className="w-6 h-6 text-muted-foreground/25 group-hover:text-primary/40" />
            </div>
            <span className="text-xs text-muted-foreground">Tìm thêm</span>
          </Link>
        </div>
      </div>

      {/* Match list */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tất cả</h3>
        {matched.map(({ user, timestamp }, i) => {
          const cc = user.interests.filter((x) => me.interests.includes(x)).length;
          return (
            <Link key={user.id} to="/messages" className="flex items-center gap-3 p-3 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all group animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-card"><img src={user.avatar} alt="" className="w-full h-full object-cover bg-primary/5" /></div>
                {user.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-[15px]">{user.name}, {user.age}</h3>
                  {user.isVerified && <Verified className="w-4 h-4 text-[#00D4FF]" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{user.occupation}</p>
                <div className="flex items-center gap-2 mt-1">
                  {cc > 0 && <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5"><Star className="w-3 h-3" />{cc} chung</span>}
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-3 h-3" />{fmt(timestamp)}</span>
                </div>
              </div>
              <Button size="sm" className="gradient-hot border-0 text-white rounded-xl shadow-card group-hover:shadow-elevated">
                <MessageCircle className="w-4 h-4 mr-1" /> Chat
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Matches;
