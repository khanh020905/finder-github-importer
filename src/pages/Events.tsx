import { useState } from "react";
import { mockEvents } from "@/lib/mock-data";
import { EventCard } from "@/components/finder/EventCard";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CalendarDays,
  Search,
  SlidersHorizontal,
  Sparkles,
  Filter,
  Flame,
  Gamepad2,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const categories = ["Tất cả", "Music", "Workshop", "Sports", "Social", "Study"];

const Events = () => {
  const { user, profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activeTab, setActiveTab] = useState<"events" | "community">("events");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesCategory =
      activeCategory === "Tất cả" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Premium Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-3xl font-black italic font-serif-display text-gradient-flame flex items-center gap-2">
              Sự kiện{" "}
              <Sparkles className="w-6 h-6 text-primary fill-primary/10" />
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 pl-1">
              Khám phá nhịp sống campus
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl gradient-hot text-white flex items-center justify-center shadow-glow border-0"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Search & Tabs Controls */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                activeTab === "events"
                  ? "bg-primary text-white shadow-glow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Sự kiện
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                activeTab === "community"
                  ? "bg-primary text-white shadow-glow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Cộng đồng
              <Flame className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "events" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sự kiện, mini-show, giải đấu..."
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card border border-border/10 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-soft font-medium"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                        activeCategory === cat
                          ? "gradient-hot text-white border-transparent shadow-md"
                          : "bg-card text-muted-foreground border-border/5 hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "events" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-1">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  key={event.id}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto opacity-20">
                  <CalendarDays className="w-10 h-10" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Không tìm thấy sự kiện nào phù hợp.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 px-1"
        >
          {/* Streak Badge */}
          <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/10 flex items-center gap-6 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl mix-blend-screen" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex flex-col items-center justify-center text-white shadow-glow shrink-0 rotate-3 z-10 transition-transform hover:scale-105 hover:rotate-6">
              <Flame className="w-8 h-8 fill-white/20" />
              <span className="font-black text-xl leading-none mt-1">3</span>
              <span className="text-[9px] font-black uppercase tracking-widest mt-0.5">
                Ngày
              </span>
            </div>
            <div className="z-10">
              <h3 className="text-lg font-black tracking-tight mb-1">
                Chuỗi hoạt động
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Bạn đang có chuỗi 3 ngày hoạt động liên tục! Cố gắng duy trì để
                nhận huy hiệu độc quyền nhé. 🔥
              </p>
            </div>
          </div>

          {/* Mini game */}
          <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                  <Gamepad2 className="w-3.5 h-3.5" /> Mini Game
                </div>
                <h3 className="text-2xl font-black italic font-serif-display text-gradient-flame">
                  Sự thật & Thử thách
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-6 relative z-10">
              Phá băng dễ dàng với những câu hỏi Truth or Dare ngẫu nhiên siêu
              mặn dành cho người mới ghép đôi!
            </p>

            <Button className="w-full rounded-2xl h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-white shadow-glow relative z-10">
              Chơi ngay
            </Button>
          </div>

          {/* Leaderboard snippet */}
          <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="font-bold">Bảng Xếp Hạng Giao Lưu</h3>
              </div>
              <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Thanh Trúc",
                  points: 2450,
                  rank: 1,
                  avatar: "thanhtruc",
                },
                {
                  name: "Hoàng Nam",
                  points: 2120,
                  rank: 2,
                  avatar: "hoangnam",
                },
                {
                  name: "Mai Phương",
                  points: 1890,
                  rank: 3,
                  avatar: "maiphuong",
                },
                {
                  name: user?.user_metadata?.name || profile?.name || "Bạn",
                  points: 450,
                  rank: 124,
                  avatar: user?.id || "default",
                  isMe: true,
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-2xl ${p.isMe ? "bg-primary/5 border border-primary/20" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-black ${p.rank === 1 ? "text-yellow-500" : p.rank === 2 ? "text-gray-400" : p.rank === 3 ? "text-amber-700" : "text-muted-foreground/50"}`}
                    >
                      #{p.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <img
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${p.avatar}&backgroundColor=ffd5dc`}
                        alt=""
                      />
                    </div>
                    <div>
                      <span className="font-bold block text-sm">
                        {p.name} {p.isMe && "(Bạn)"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <span className="text-primary font-bold">
                          {p.points}
                        </span>{" "}
                        điểm
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Action Hint */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-elevated flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-black bg-muted overflow-hidden"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  alt=""
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-white uppercase tracking-wider">
            50+ người đang online
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
