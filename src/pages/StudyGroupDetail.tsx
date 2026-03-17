import { useParams, useNavigate } from "react-router-dom";
import { mockGroups } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Clock,
  Users,
  BookOpen,
  MessageCircle,
  Share2,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const StudyGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const group = mockGroups.find((g) => g.id === id);

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy nhóm</h2>
        <Button onClick={() => navigate("/study-groups")} variant="outline">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isFull = group.members >= group.maxMembers;
  const spotsLeft = group.maxMembers - group.members;

  const handleJoin = () => {
    toast({
      title: "🎓 Đã tham gia nhóm!",
      description: `Bạn đã tham gia ${group.name}. Chúc bạn học tập hiệu quả!`,
      className: "bg-secondary text-white border-none",
    });
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="relative w-full h-[30vh] rounded-b-[2.5rem] overflow-hidden shadow-soft mb-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
        
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between safe-area-top">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-center px-6 leading-tight drop-shadow-md tracking-tight">
            {group.name}
          </h1>
          <p className="text-sm font-bold mt-2 text-white/80 uppercase tracking-widest">
            {group.subject}
          </p>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-card border border-border/5 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Lịch học
              </p>
              <p className="font-bold text-sm">{group.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-card border border-border/5 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Địa điểm
              </p>
              <p className="font-bold text-sm">{group.location}</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="p-6 rounded-3xl bg-card border border-border/5 shadow-soft">
          <h3 className="text-lg font-black mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" /> Về nhóm này
          </h3>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            {group.description || "Cùng nhau học tập và chia sẻ kiến thức để đạt kết quả tốt nhất!"}
          </p>
        </div>

        {/* Category Badge */}
        <div className="p-5 rounded-3xl bg-card border border-border/5 shadow-soft">
          <h3 className="text-sm font-black mb-3 uppercase tracking-wider text-muted-foreground">Thể loại</h3>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-sm">
            <Star className="w-4 h-4" />
            {group.category}
          </span>
        </div>

        {/* Members */}
        <div className="p-6 rounded-3xl bg-card border border-border/10 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full" />
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Thành viên
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(group.members, 5) }, (_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background overflow-hidden relative z-10"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${group.id}${i}&backgroundColor=ffd5dc`}
                    alt=""
                  />
                </div>
              ))}
              {group.members > 5 && (
                <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold relative z-0">
                  +{group.members - 5}
                </div>
              )}
            </div>
            <p className="text-sm font-medium">
              <span className="font-bold text-secondary">{group.members}</span> / {group.maxMembers} thành viên
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleJoin}
            disabled={isFull}
            className={`w-full h-14 rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all ${
              isFull
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isFull ? "Nhóm đã đầy" : "Tham gia nhóm ngay"}
          </Button>
          {!isFull && spotsLeft <= 3 && (
            <p className="text-center text-xs text-orange-500 font-bold animate-pulse">
              Chỉ còn {spotsLeft} chỗ cuối cùng!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupDetail;
