import { useParams, useNavigate } from "react-router-dom";
import { mockEvents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy sự kiện</h2>
        <Button onClick={() => navigate("/events")} variant="outline">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const spotsLeft = event.maxParticipants - event.participants;
  const isFull = spotsLeft <= 0;
  const imageUrl =
    event.image || `https://picsum.photos/seed/event-${event.id}/800/450`;

  const handleRegister = () => {
    toast({
      title: "🎉 Đăng ký thành công!",
      description: `Bạn đã đăng ký tham gia ${event.title}. Hẹn gặp bạn ở đó nhé!`,
      className: "bg-primary text-primary-foreground border-none",
    });
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] rounded-b-[2.5rem] overflow-hidden shadow-soft mb-8">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between safe-area-top">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Category */}
        <div className="absolute bottom-6 left-6">
          <Badge className="bg-primary hover:bg-primary text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-glow mb-2">
            {event.category || "EVENT"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md tracking-tight">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="px-5 space-y-8">
        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-4 p-4 rounded-3xl bg-card border border-border/5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Ngày tổ chức
              </p>
              <p className="font-bold">{event.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Thời gian
              </p>
              <p className="font-bold">{event.time}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-3xl bg-card border border-border/5 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Địa điểm
            </p>
            <p className="font-bold">{event.location}</p>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              Campus Đại học FPT TP.HCM
            </p>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-xl font-black mb-3">Về sự kiện này</h3>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Registration Section */}
        <div className="p-6 rounded-3xl bg-card border border-border/10 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
          <h3 className="text-lg font-black mb-4">Thông tin đăng ký</h3>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background overflow-hidden relative z-10"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${event.id}${i}&backgroundColor=ffd5dc`}
                    alt=""
                  />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold relative z-0">
                +{event.participants - 3}
              </div>
            </div>
            <p className="text-sm font-medium">
              <span className="font-bold text-primary">
                {event.participants}
              </span>{" "}
              / {event.maxParticipants} người tham gia
            </p>
          </div>

          <Button
            onClick={handleRegister}
            disabled={isFull}
            className={`w-full h-14 rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all ${
              isFull
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "gradient-hot text-white shadow-glow hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isFull ? "Đã hết chỗ trống" : "Xác nhận đăng ký tham gia"}
          </Button>
          {!isFull && spotsLeft <= 10 && (
            <p className="text-center text-xs text-orange-500 font-bold mt-3 animate-pulse">
              Chỉ còn {spotsLeft} suất cuối cùng! Nhanh tay nhé!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
