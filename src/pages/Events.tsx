import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Flame,
  Gamepad2,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Events = () => {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-3xl font-black italic font-serif-display text-gradient-flame flex items-center gap-2">
              Cộng đồng{" "}
              <Flame className="w-6 h-6 text-orange-400 fill-orange-400/20" />
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 pl-1">
              Khám phá nhịp sống campus
            </p>
          </div>
        </div>
      </div>

      {/* Community Content */}
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
