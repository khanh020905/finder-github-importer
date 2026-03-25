import { useState } from "react";
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
  FileText,
  Download,
  Calendar,
  Wifi,
  Shield,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const levelColors = {
  Beginner: "from-green-500 to-emerald-500",
  Intermediate: "from-blue-500 to-indigo-500",
  Advanced: "from-purple-500 to-pink-500",
};

const levelLabels = {
  Beginner: "Cơ bản",
  Intermediate: "Trung cấp",
  Advanced: "Nâng cao",
};

// Mock discussion data
const mockDiscussions = [
  { id: 1, user: "Minh Tuấn", avatar: "minh-tuan", content: "Mọi người nhớ ôn chương 5 trước buổi tới nhé! 📚", time: "2 giờ trước", role: "admin" },
  { id: 2, user: "Hải Nam", avatar: "hai-nam", content: "Mình đã upload slide bài giảng vào drive rồi ạ 🙌", time: "5 giờ trước", role: "member" },
  { id: 3, user: "Thu Trang", avatar: "thu-trang", content: "Có ai giải được bài 3.7 không ạ? Mình stuck quá 😅", time: "1 ngày trước", role: "member" },
];

// Mock resources
const mockResources = [
  { id: 1, name: "Slide Chương 5 - Ma trận", type: "PDF", size: "2.4 MB" },
  { id: 2, name: "Đề thi thử Midterm 2025", type: "DOCX", size: "1.1 MB" },
  { id: 3, name: "Bài giải chi tiết", type: "PDF", size: "3.8 MB" },
  { id: 4, name: "Video giải bài tập", type: "MP4", size: "45 MB" },
];

// Mock reviews
const mockReviews = [
  { id: 1, user: "Phương Anh", avatar: "phuong-anh", rating: 5, content: "Nhóm học rất hiệu quả, admin nhiệt tình!", time: "1 tuần trước" },
  { id: 2, user: "Hoàng Long", avatar: "hoang-long", rating: 4, content: "Không khí thoải mái, dễ hiểu. Recommend!", time: "2 tuần trước" },
];

const StudyGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"about" | "discussion" | "resources" | "reviews">("about");
  const [newMessage, setNewMessage] = useState("");

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
  const fillPercent = (group.members / group.maxMembers) * 100;

  const nextDate = new Date(group.nextSession);
  const formattedNext = nextDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleJoin = () => {
    toast({
      title: "🎓 Đã tham gia nhóm!",
      description: `Bạn đã tham gia ${group.name}. Chúc bạn học tập hiệu quả!`,
      className: "bg-secondary text-white border-none",
    });
  };

  const tabs = [
    { key: "about", label: "Tổng quan", icon: BookOpen },
    { key: "discussion", label: "Thảo luận", icon: MessageCircle },
    { key: "resources", label: "Tài liệu", icon: FileText },
    { key: "reviews", label: "Đánh giá", icon: Star },
  ] as const;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className={`relative w-full h-[32vh] rounded-b-[2.5rem] overflow-hidden shadow-soft mb-6 bg-gradient-to-br ${levelColors[group.level]}`}>
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

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-center leading-tight drop-shadow-md tracking-tight">
            {group.name}
          </h1>
          <p className="text-sm font-bold mt-2 text-white/80 uppercase tracking-widest">
            {group.subject}
          </p>
          <div className="flex items-center gap-3 mt-3">
            {group.isOnline && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
                <Wifi className="w-3 h-3" /> Online
              </span>
            )}
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
              {levelLabels[group.level]}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-white/80" /> {group.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Creator card */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/5 shadow-soft">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted ring-2 ring-secondary/20">
            <img
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${group.createdBy.avatar}&backgroundColor=ffd5dc`}
              alt={group.createdBy.name}
              className="w-full h-full"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{group.createdBy.name}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Quản trị viên nhóm</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black">
            <Shield className="w-3 h-3" /> Admin
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/5 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Lịch học</p>
              <p className="font-bold text-xs">{group.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/5 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Địa điểm</p>
              <p className="font-bold text-xs">{group.location}</p>
            </div>
          </div>
        </div>

        {/* Next session banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
          <Calendar className="w-5 h-5 text-secondary shrink-0" />
          <div>
            <p className="text-[9px] uppercase font-bold text-secondary tracking-widest">Buổi học tiếp theo</p>
            <p className="font-bold text-sm">{formattedNext}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {group.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tab Navs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-wider ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* About Section */}
            <div className="p-5 rounded-2xl bg-card border border-border/5 shadow-soft">
              <h3 className="text-base font-black mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" /> Về nhóm này
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Members */}
            <div className="p-5 rounded-2xl bg-card border border-border/10 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full" />
              <h3 className="text-base font-black mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Thành viên
              </h3>
              <div className="space-y-3 mb-4">
                {Array.from({ length: Math.min(group.members, 5) }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-background overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${group.id}${i}&backgroundColor=ffd5dc`}
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold">
                        {i === 0 ? group.createdBy.name : `Thành viên ${i + 1}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        {i === 0 ? "Admin" : "Member"}
                      </span>
                    </div>
                  </div>
                ))}
                {group.members > 5 && (
                  <p className="text-xs text-muted-foreground font-medium pl-12">
                    +{group.members - 5} thành viên khác
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-medium">
                  <span className="font-bold text-secondary">{group.members}</span> / {group.maxMembers} thành viên
                </p>
              </div>
              <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "discussion" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-5 rounded-2xl bg-card border border-border/5 shadow-soft space-y-4">
              <h3 className="text-base font-black flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-secondary" /> Bảng thảo luận
              </h3>
              {mockDiscussions.map((msg) => (
                <div key={msg.id} className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${msg.avatar}&backgroundColor=ffd5dc`}
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold">{msg.user}</span>
                      {msg.role === "admin" && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">Admin</span>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Message input */}
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Viết tin nhắn..."
                className="flex-1 h-12 px-4 rounded-2xl bg-card border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newMessage.trim()) {
                    toast({ title: "📨 Đã gửi!", description: "Tin nhắn của bạn đã được gửi." });
                    setNewMessage("");
                  }
                }}
                className="w-12 h-12 rounded-2xl gradient-secondary text-white flex items-center justify-center shadow-glow-secondary"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "resources" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-card border border-border/5 shadow-soft space-y-3"
          >
            <h3 className="text-base font-black flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-secondary" /> Tài liệu chia sẻ
            </h3>
            {mockResources.map((res) => (
              <div key={res.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[9px] font-black shrink-0 ${
                  res.type === "PDF" ? "bg-red-500" : res.type === "DOCX" ? "bg-blue-500" : "bg-purple-500"
                }`}>
                  {res.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{res.name}</p>
                  <p className="text-[10px] text-muted-foreground">{res.size}</p>
                </div>
                <Download className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Rating summary */}
            <div className="p-5 rounded-2xl bg-card border border-border/5 shadow-soft text-center">
              <p className="text-4xl font-black text-secondary">{group.rating}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${s <= Math.round(group.rating) ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {mockReviews.length} đánh giá từ thành viên
              </p>
            </div>

            {/* Reviews */}
            {mockReviews.map((review) => (
              <div key={review.id} className="p-4 rounded-2xl bg-card border border-border/5 shadow-soft">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                    <img
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${review.avatar}&backgroundColor=ffd5dc`}
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{review.user}</p>
                    <p className="text-[10px] text-muted-foreground">{review.time}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
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
