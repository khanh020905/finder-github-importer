import { useState, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  X,
  MapPin,
  Star,
  RotateCcw,
  Zap,
  Info,
  Verified,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, Profile } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

const SwipeCard = ({
  card,
  myProfile,
  onSwipe,
  isFront,
}: {
  card: Profile;
  myProfile: Profile | null;
  onSwipe: (dir: "left" | "right" | "up") => void;
  isFront: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const avatarUrl =
    card.avatar_url ||
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${card.id}&backgroundColor=ffd5dc`;

  const commonInterests = myProfile
    ? card.interests.filter((i) => myProfile.interests.includes(i))
    : [];

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
    else if (info.offset.y < -100) onSwipe("up");
  };

  return (
    <motion.div
      style={
        isFront
          ? { x, rotate, opacity, zIndex: 10 }
          : { scale: 0.95, y: 10, opacity: 0.5, zIndex: 5 }
      }
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={isFront ? { scale: 0.98 } : {}}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-elevated bg-card touch-none"
    >
      <div
        className={`relative transition-all duration-300 ${expanded ? "h-[45%]" : "h-full"}`}
      >
        <img
          src={avatarUrl}
          alt=""
          className="w-full h-full object-cover bg-primary/5 select-none"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Swipe Overlays */}
        {isFront && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-10 left-10 border-4 border-green-500 rounded-xl px-4 py-2 rotate-[-20deg] z-30"
            >
              <span className="text-4xl font-black text-green-500 uppercase tracking-tighter">
                LIKE
              </span>
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-10 right-10 border-4 border-red-500 rounded-xl px-4 py-2 rotate-[20deg] z-30"
            >
              <span className="text-4xl font-black text-red-500 uppercase tracking-tighter">
                NOPE
              </span>
            </motion.div>
          </>
        )}

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black">
              {card.name}
              {card.age && `, ${card.age}`}
            </h2>
            {card.is_verified && (
              <Verified className="w-6 h-6 text-superblue-500 fill-white" />
            )}
          </div>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {card.city || "Nearby"}{" "}
            {card.university ? `• ${card.university}` : ""}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex items-center gap-1 mt-3 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-white/90 text-xs transition-colors hover:bg-white/20"
          >
            <Info className="w-3.5 h-3.5" />
            {expanded ? "Thu gọn" : "Xem thêm thông tin"}
            <ChevronUp
              className={`w-3.5 h-3.5 transition-transform ${expanded ? "" : "rotate-180"}`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-5 animate-slide-up overflow-y-auto h-[55%]">
          {card.bio && (
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Giới thiệu
              </h4>
              <p className="text-sm leading-relaxed">{card.bio}</p>
            </div>
          )}

          {card.interests.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Sở thích
              </h4>
              <div className="flex flex-wrap gap-2">
                {card.interests.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      commonInterests.includes(tag) ? "default" : "secondary"
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium ${commonInterests.includes(tag) ? "gradient-hot text-white border-0 shadow-sm" : "bg-muted/50"}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const Swipe = () => {
  const { user, profile: myProfile } = useAuth();
  const { toast } = useToast();
  const [cards, setCards] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchPopup, setMatchPopup] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchUsers = async () => {
      setLoading(true);
      const { data: existingLikes } = await supabase
        .from("likes")
        .select("to_user")
        .eq("from_user", user.id);
      const excludeIds = new Set((existingLikes || []).map((l) => l.to_user));
      excludeIds.add(user.id);

      let query = supabase.from("profiles").select("*").neq("id", user.id);
      if (
        myProfile?.gender_preference &&
        myProfile.gender_preference !== "all"
      ) {
        query = query.eq("gender", myProfile.gender_preference);
      }

      const { data } = await query
        .order("last_active", { ascending: false })
        .limit(50);
      const filtered = (data || []).filter(
        (p) => !excludeIds.has(p.id) && p.name,
      );
      setCards(filtered);
      setCurrentIndex(0);
      setLoading(false);
    };
    fetchUsers();
  }, [user, myProfile?.gender_preference]);

  const handleSwipeEffect = useCallback(
    async (direction: "left" | "right" | "up") => {
      const currentCard = cards[currentIndex];
      if (!currentCard || !user) return;

      if (direction === "right" || direction === "up") {
        const isSuperLike = direction === "up";
        await supabase.from("likes").insert({
          from_user: user.id,
          to_user: currentCard.id,
          is_super_like: isSuperLike,
        });

        const { data: matchData } = await supabase
          .from("matches")
          .select("*")
          .or(
            `and(user1.eq.${user.id},user2.eq.${currentCard.id}),and(user1.eq.${currentCard.id},user2.eq.${user.id})`,
          )
          .maybeSingle();

        if (matchData) setMatchPopup(currentCard);
      }

      setCurrentIndex((prev) => prev + 1);
    },
    [cards, currentIndex, user],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            <Heart className="absolute inset-0 m-auto w-8 h-8 text-primary fill-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm font-medium animate-pulse">
            Đang tìm kiếm người ấy...
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="flex items-center justify-center h-[70vh] px-6">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-12 h-12 text-primary/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic font-serif-display">
              That's everyone! 🎉
            </h3>
            <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
              Bạn đã xem hết hồ sơ phù hợp. Hãy quay lại sau nhé!
            </p>
          </div>
          <Button
            onClick={() => setCurrentIndex(0)}
            variant="outline"
            className="rounded-full px-8 py-6 h-auto font-bold shadow-soft hover:shadow-card transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Xem lại từ đầu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col pt-4">
      {/* Match popup */}
      <AnimatePresence>
        {matchPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setMatchPopup(null)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              className="text-center space-y-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-5xl font-black italic font-serif-display text-white drop-shadow-lg">
                It's a Match!
              </h2>
              <div className="flex items-center justify-center gap-4 py-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-glow relative z-10">
                    <img
                      src={
                        myProfile?.avatar_url ||
                        `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.id}`
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                </div>
                <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat drop-shadow-glow z-20" />
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-glow relative z-10">
                    <img
                      src={
                        matchPopup.avatar_url ||
                        `https://api.dicebear.com/7.x/lorelei/svg?seed=${matchPopup.id}`
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </div>
              <p className="text-white/80 text-lg leading-relaxed px-4">
                Bạn và{" "}
                <span className="font-bold text-white tracking-tight underline decoration-primary decoration-4 underline-offset-4">
                  {matchPopup.name}
                </span>{" "}
                đã thích nhau!
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <Button
                  onClick={() => (window.location.href = "/messages")}
                  className="gradient-hot text-white rounded-full h-16 text-lg font-bold shadow-glow border-0 transition-transform active:scale-95"
                >
                  Gửi tin nhắn ngay 💬
                </Button>
                <button
                  onClick={() => setMatchPopup(null)}
                  className="text-white/60 text-sm font-semibold hover:text-white transition-colors"
                >
                  Tiếp tục tìm kiếm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1 max-w-[400px] mx-auto w-full">
        {/* Card stack back cards (visual only) */}
        {currentIndex + 1 < cards.length && (
          <div className="absolute inset-0 scale-[0.92] translate-y-6 opacity-30 blur-[1px]">
            <SwipeCard
              card={cards[currentIndex + 1]}
              myProfile={myProfile}
              onSwipe={() => {}}
              isFront={false}
            />
          </div>
        )}

        {/* Current card */}
        <AnimatePresence mode="popLayout">
          <SwipeCard
            key={cards[currentIndex].id}
            card={cards[currentIndex]}
            myProfile={myProfile}
            onSwipe={handleSwipeEffect}
            isFront={true}
          />
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 py-8 relative z-20">
        <button
          onClick={() =>
            currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
          }
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center text-yellow-500 hover:shadow-glow transition-all active:scale-90 disabled:opacity-20 flex-shrink-0"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleSwipeEffect("left")}
          className="w-16 h-16 rounded-full bg-card shadow-card flex items-center justify-center text-red-500 hover:shadow-elevated transition-all active:scale-90 flex-shrink-0"
        >
          <X className="w-8 h-8" strokeWidth={3} />
        </button>
        <button
          onClick={() => handleSwipeEffect("up")}
          className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center text-blue-400 hover:shadow-elevated transition-all active:scale-90 flex-shrink-0"
        >
          <Star className="w-6 h-6 fill-blue-400/10" />
        </button>
        <button
          onClick={() => handleSwipeEffect("right")}
          className="w-16 h-16 rounded-full gradient-hot shadow-glow flex items-center justify-center text-white hover:scale-110 hover:shadow-romantic transition-all active:scale-90 flex-shrink-0"
        >
          <Heart className="w-8 h-8 fill-white" />
        </button>
        <button className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center text-purple-500 hover:shadow-glow transition-all active:scale-90 flex-shrink-0">
          <Zap className="w-6 h-6 fill-purple-500/10" />
        </button>
      </div>
    </div>
  );
};

export default Swipe;
