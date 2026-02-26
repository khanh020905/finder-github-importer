import { useState, useCallback, useEffect } from "react";
import { mockUsers, mockLikes, type User } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, Star, RotateCcw, Zap, Info, Verified, Music, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const me = mockUsers[0];

const Swipe = () => {
  const [cards] = useState<User[]>(mockUsers.filter((u) => u.id !== me.id));
  const [idx, setIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | "super" | null>(null);
  const [showMatch, setShowMatch] = useState<User | null>(null);
  const [likes] = useState(mockLikes);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [heartFlies, setHeartFlies] = useState<number[]>([]);
  const [confetti, setConfetti] = useState<Array<{id:number;x:number;color:string;d:number}>>([]);

  const card = cards[idx];
  const common = card ? card.interests.filter((i) => me.interests.includes(i)) : [];

  useEffect(() => { setPhotoIdx(0); setShowInfo(false); }, [idx]);

  const handleSwipe = useCallback((dir: "left" | "right" | "super") => {
    if (!card) return;
    setSwipeDir(dir);

    if (dir === "right") {
      setHeartFlies((p) => [...p, Date.now()]);
      setTimeout(() => setHeartFlies((p) => p.slice(1)), 700);
    }

    setTimeout(() => {
      if (dir === "right" || dir === "super") {
        const mutual = likes.some((l) => l.fromUserId === card.id && l.toUserId === me.id);
        if (mutual) {
          const pieces = Array.from({ length: 24 }, (_, i) => ({
            id: i, x: Math.random() * 100,
            color: ["#FF4458","#FD267A","#FF6036","#FFB347","#00D4FF","#6C5CE7"][Math.floor(Math.random()*6)],
            d: Math.random() * 0.6,
          }));
          setConfetti(pieces);
          setShowMatch(card);
        }
      }
      setIdx((p) => p + 1);
      setSwipeDir(null);
    }, 400);
  }, [card, likes]);

  // ── Match Popup ──
  if (showMatch) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
        {confetti.map((p) => (
          <div key={p.id} className="absolute w-3 h-3 rounded-full animate-confetti" style={{ left: `${p.x}%`, top: "50%", backgroundColor: p.color, animationDelay: `${p.d}s`, animationDuration: `${0.8+Math.random()}s` }} />
        ))}
        <div className="relative z-10 text-center space-y-6 p-8 animate-scale-in max-w-sm">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em]">It's a</p>
          <h1 className="text-5xl font-black text-gradient-flame">Match!</h1>
          <div className="relative flex justify-center mt-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-primary shadow-glow -mr-5 z-10">
              <img src={me.avatar} alt="" className="w-full h-full object-cover bg-primary/10" />
            </div>
            <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-secondary shadow-glow -ml-5">
              <img src={showMatch.avatar} alt="" className="w-full h-full object-cover bg-secondary/10" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full gradient-hot flex items-center justify-center shadow-glow animate-heartbeat">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          <p className="text-white/70 text-sm">Bạn và <strong className="text-white">{showMatch.name}</strong> đã thích nhau</p>
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl h-12 px-6" onClick={() => setShowMatch(null)}>Tiếp tục Swipe</Button>
            <Button className="gradient-hot border-0 text-white rounded-2xl h-12 px-6 shadow-glow" onClick={() => { setShowMatch(null); window.location.href = "/messages"; }}>Gửi tin nhắn 💬</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── No more cards ──
  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-center space-y-4 animate-fade-in">
        <div className="w-28 h-28 rounded-3xl bg-muted/30 flex items-center justify-center animate-float">
          <Heart className="w-12 h-12 text-muted-foreground/40" />
        </div>
        <h2 className="text-xl font-bold">Hết gợi ý rồi!</h2>
        <p className="text-muted-foreground text-sm max-w-[260px]">Mở rộng khoảng cách hoặc quay lại sau nhé 🔥</p>
        <Button variant="outline" onClick={() => setIdx(0)} className="rounded-2xl">
          <RotateCcw className="w-4 h-4 mr-2" /> Xem lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in relative">
      {/* Flying hearts */}
      {heartFlies.map((id) => (
        <div key={id} className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <Heart className="w-8 h-8 text-primary fill-primary animate-heart-fly" />
        </div>
      ))}

      {/* ═══ Card ═══ */}
      <div className={`relative w-full max-w-[370px] rounded-3xl shadow-elevated overflow-hidden transition-all duration-400 ${
        swipeDir === "left" ? "animate-swipe-left" : swipeDir === "right" ? "animate-swipe-right" : swipeDir === "super" ? "animate-swipe-up" : ""
      }`}>
        {/* Photo */}
        <div className="relative h-[480px] bg-muted overflow-hidden">
          <img src={card.photos[photoIdx] || card.avatar} alt={card.name} className="w-full h-full object-cover" />

          {/* Photo dots */}
          {card.photos.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {card.photos.map((_, i) => (
                <div key={i} className={`h-[3px] rounded-full transition-all flex-1 ${i === photoIdx ? "bg-white" : "bg-white/25"}`} />
              ))}
            </div>
          )}

          {/* Tap zones */}
          <button onClick={() => setPhotoIdx(Math.max(0, photoIdx - 1))} className="absolute left-0 top-0 w-1/3 h-full" />
          <button onClick={() => setPhotoIdx(Math.min(card.photos.length - 1, photoIdx + 1))} className="absolute right-0 top-0 w-1/3 h-full" />

          {/* Swipe labels */}
          {swipeDir === "right" && <div className="absolute top-10 left-6 border-[3px] border-green-400 text-green-400 font-black text-3xl px-5 py-2 rounded-2xl rotate-[-12deg] animate-scale-in tracking-wider">LIKE</div>}
          {swipeDir === "left" && <div className="absolute top-10 right-6 border-[3px] border-red-400 text-red-400 font-black text-3xl px-5 py-2 rounded-2xl rotate-[12deg] animate-scale-in tracking-wider">NOPE</div>}
          {swipeDir === "super" && <div className="absolute top-1/4 left-1/2 -translate-x-1/2 border-[3px] border-superblue-500 text-[#00D4FF] font-black text-3xl px-5 py-2 rounded-2xl animate-scale-in tracking-wider">SUPER</div>}

          {/* Badges */}
          <div className="absolute top-4 right-3 flex flex-col gap-1.5">
            {card.isVerified && (
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1">
                <Verified className="w-3 h-3 text-[#00D4FF]" />
                <span className="text-white text-[10px] font-semibold">Verified</span>
              </div>
            )}
            {card.isOnline && (
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-[10px] font-medium">Online</span>
              </div>
            )}
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-28">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-[28px] font-bold text-white leading-tight flex items-center gap-2">
                  {card.name}<span className="text-white/70 font-normal text-2xl">{card.age}</span>
                </h2>
                <p className="text-white/60 text-sm mt-0.5">{card.occupation}</p>
                <div className="flex items-center gap-1.5 text-white/50 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{card.distance} km away</span>
                  <span className="mx-1">·</span>
                  <span>{card.location}</span>
                </div>
                {/* Anthem */}
                {card.anthem && (
                  <div className="flex items-center gap-1.5 mt-2 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 w-fit">
                    <Music className="w-3 h-3 text-green-400" />
                    <span className="text-white/80 text-[10px] font-medium truncate max-w-[180px]">{card.anthem}</span>
                  </div>
                )}
              </div>
              <button onClick={() => setShowInfo(!showInfo)} className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all shrink-0">
                <ChevronUp className={`w-5 h-5 transition-transform ${showInfo ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable info */}
        <div className={`bg-card transition-all duration-350 overflow-hidden ${showInfo ? "max-h-[500px] p-5" : "max-h-0"}`}>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{card.bio}</p>

            {common.length > 0 && (
              <div>
                <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Star className="w-3 h-3" /> {common.length} sở thích chung</p>
                <div className="flex flex-wrap gap-1.5">
                  {common.map((i) => <Badge key={i} className="text-[11px] gradient-hot border-0 text-white rounded-full px-3">{i}</Badge>)}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {card.interests.filter((i) => !common.includes(i)).map((i) => (
                <Badge key={i} variant="secondary" className="text-[11px] rounded-full px-3">{i}</Badge>
              ))}
            </div>

            {card.instagram && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>📸</span> <span>{card.instagram}</span>
              </div>
            )}

            {card.badges && card.badges.length > 0 && (
              <div className="flex gap-2">
                {card.badges.map((b) => (
                  <div key={b} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-primary/8 text-primary font-semibold">
                    {b === "Top Picks" ? "⭐" : "✓"} {b}
                  </div>
                ))}
              </div>
            )}

            {/* Mini map hint */}
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors text-left">
              <div className="w-10 h-10 rounded-xl gradient-map flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold">{card.location}</p>
                <p className="text-[11px] text-muted-foreground">Xem trên Google Maps · {card.distance}km</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick bio (collapsed) */}
        {!showInfo && (
          <div className="bg-card p-4">
            <p className="text-sm text-muted-foreground line-clamp-1">{card.bio}</p>
            {common.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                {common.slice(0, 3).map((i) => <Badge key={i} className="text-[10px] gradient-hot border-0 text-white rounded-full px-2.5">{i}</Badge>)}
                {common.length > 3 && <span className="text-[10px] text-primary font-semibold">+{common.length-3}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Action Buttons ═══ */}
      <div className="flex items-center gap-3 mt-5">
        <button onClick={() => { if(idx>0) setIdx(idx-1); }} className="w-12 h-12 rounded-full bg-card shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-90">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => handleSwipe("left")} className="w-[64px] h-[64px] rounded-full bg-card shadow-elevated flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 hover:shadow-glow">
          <X className="w-8 h-8" strokeWidth={3} />
        </button>
        <button onClick={() => handleSwipe("super")} className="w-12 h-12 rounded-full gradient-super shadow-super flex items-center justify-center text-white transition-all active:scale-90 hover:scale-105">
          <Star className="w-5 h-5 fill-white" />
        </button>
        <button onClick={() => handleSwipe("right")} className="w-[64px] h-[64px] rounded-full gradient-hot shadow-elevated flex items-center justify-center text-white hover:scale-105 transition-all active:scale-90 animate-flame-glow">
          <Heart className="w-8 h-8 fill-white" />
        </button>
        <button className="w-12 h-12 rounded-full gradient-gold shadow-gold flex items-center justify-center text-white transition-all active:scale-90 hover:scale-105">
          <Zap className="w-5 h-5 fill-white" />
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/40 mt-3">{idx + 1} / {cards.length}</p>
    </div>
  );
};

export default Swipe;
