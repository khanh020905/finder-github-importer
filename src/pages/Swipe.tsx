import { useState, useCallback } from "react";
import { mockUsers, mockMatches, mockLikes, type User, type Match } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, X, MapPin, Briefcase, GraduationCap, Star, RotateCcw } from "lucide-react";

const currentUser = mockUsers[0];

const Swipe = () => {
  const [cards, setCards] = useState<User[]>(
    mockUsers.filter((u) => u.id !== currentUser.id)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [showMatch, setShowMatch] = useState<User | null>(null);
  const [likes] = useState(mockLikes);

  const currentCard = cards[currentIndex];

  const commonInterests = currentCard
    ? currentCard.interests.filter((i) => currentUser.interests.includes(i))
    : [];

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentCard) return;
      setSwipeDir(direction);

      setTimeout(() => {
        if (direction === "right") {
          // Check if the other user already liked us
          const theyLikedUs = likes.some(
            (l) => l.fromUserId === currentCard.id && l.toUserId === currentUser.id
          );
          if (theyLikedUs) {
            setShowMatch(currentCard);
          }
        }
        setCurrentIndex((prev) => prev + 1);
        setSwipeDir(null);
      }, 300);
    },
    [currentCard, likes]
  );

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (showMatch) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="flex justify-center gap-4">
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold border-4 border-primary-foreground/30">
                {currentUser.name[0]}
              </div>
              <div className="w-24 h-24 rounded-full gradient-warm flex items-center justify-center text-primary-foreground text-3xl font-bold border-4 border-primary-foreground/30">
                {showMatch.name[0]}
              </div>
            </div>
            <Heart className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground">It's a Match! 🎉</h1>
            <p className="text-primary-foreground/80 mt-2">
              Bạn và <strong>{showMatch.name}</strong> đã thích nhau
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="bg-card/20 border-primary-foreground/30 text-primary-foreground hover:bg-card/40"
              onClick={() => setShowMatch(null)}
            >
              Tiếp tục vuốt
            </Button>
            <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => {
              setShowMatch(null);
              window.location.href = "/messages";
            }}>
              Nhắn tin ngay 💬
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Hết rồi! 😅</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Bạn đã xem hết tất cả người dùng gần đây. Quay lại sau nhé!
        </p>
        <Button variant="outline" onClick={() => setCurrentIndex(0)}>
          <RotateCcw className="w-4 h-4 mr-2" /> Xem lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Card */}
      <div
        className={`relative w-full max-w-sm bg-card rounded-2xl shadow-elevated overflow-hidden transition-all duration-300 ${
          swipeDir === "left"
            ? "-translate-x-full opacity-0 rotate-[-15deg]"
            : swipeDir === "right"
            ? "translate-x-full opacity-0 rotate-[15deg]"
            : ""
        }`}
      >
        {/* Photo area */}
        <div className="h-80 gradient-warm flex items-end relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-primary-foreground/20">
              {currentCard.name[0]}
            </span>
          </div>
          {/* Swipe indicators */}
          {swipeDir === "right" && (
            <div className="absolute top-6 left-6 border-4 border-secondary text-secondary font-bold text-2xl px-4 py-1 rounded-xl rotate-[-15deg]">
              LIKE ❤️
            </div>
          )}
          {swipeDir === "left" && (
            <div className="absolute top-6 right-6 border-4 border-destructive text-destructive font-bold text-2xl px-4 py-1 rounded-xl rotate-[15deg]">
              NOPE ✕
            </div>
          )}
          <div className="relative z-10 p-5 w-full bg-gradient-to-t from-foreground/70 to-transparent">
            <h2 className="text-2xl font-bold text-primary-foreground">
              {currentCard.name}, {currentCard.age}
            </h2>
            <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {currentCard.location} · {currentCard.distance}km
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <p className="text-sm text-muted-foreground">{currentCard.bio}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> {currentCard.major}
            </span>
            {currentCard.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> {currentCard.occupation}
              </span>
            )}
          </div>

          {/* Common interests only */}
          {commonInterests.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
                <Star className="w-3 h-3" /> Sở thích chung
              </p>
              <div className="flex flex-wrap gap-1.5">
                {commonInterests.map((interest) => (
                  <Badge key={interest} className="text-[10px] gradient-primary border-0 text-primary-foreground">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-card shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full bg-card shadow-elevated flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-90"
        >
          <X className="w-7 h-7" />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full gradient-primary shadow-elevated flex items-center justify-center text-primary-foreground hover:scale-105 transition-all active:scale-90"
        >
          <Heart className="w-7 h-7" />
        </button>
      </div>

      {/* Counter */}
      <p className="text-xs text-muted-foreground mt-4">
        {currentIndex + 1} / {cards.length}
      </p>
    </div>
  );
};

export default Swipe;
