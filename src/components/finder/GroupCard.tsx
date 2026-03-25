import type { StudyGroup } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Users,
  GraduationCap,
  ChevronRight,
  Star,
  Wifi,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: StudyGroup;
}

const levelColors = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
};

export const GroupCard = ({ group }: GroupCardProps) => {
  const isFull = group.members >= group.maxMembers;
  const fillPercent = (group.members / group.maxMembers) * 100;
  const nextDate = new Date(group.nextSession);
  const isToday = new Date().toDateString() === nextDate.toDateString();
  const formattedNext = isToday
    ? `Hôm nay ${nextDate.getHours()}:${nextDate.getMinutes().toString().padStart(2, "0")}`
    : nextDate.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" });

  return (
    <Link to={`/study-groups/${group.id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-card rounded-[2rem] p-6 shadow-soft border border-border/5 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

        {/* Creator + Level */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted ring-2 ring-secondary/20">
              <img
                src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${group.createdBy.avatar}&backgroundColor=ffd5dc`}
                alt={group.createdBy.name}
                className="w-full h-full"
              />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">
              {group.createdBy.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {group.isOnline && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                <Wifi className="w-3 h-3" /> Online
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${levelColors[group.level]}`}>
              {group.level}
            </span>
          </div>
        </div>

        {/* Name + Subject */}
        <div className="flex items-start gap-4 mb-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 shadow-inner">
            <GraduationCap className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight leading-tight">{group.name}</h3>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-0.5">
              {group.subject}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {group.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {group.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-muted/60 text-[10px] font-bold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Info row */}
        <div className="space-y-2.5 relative z-10">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{group.schedule}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{group.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">{group.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5" />
              <span>
                {group.members}/{group.maxMembers}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 mb-1">
          <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : fillPercent > 70 ? "bg-orange-400" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Next session */}
        <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-secondary">
          <Calendar className="w-3 h-3" />
          <span>Buổi tiếp: {formattedNext}</span>
        </div>

        {/* CTA */}
        <Button
          disabled={isFull}
          className={`w-full mt-4 rounded-2xl h-11 font-black text-xs uppercase tracking-widest transition-all ${isFull ? "bg-muted" : "gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95"}`}
        >
          {isFull ? "Nhóm đã đầy" : "Xem chi tiết"}
          {!isFull && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </motion.div>
    </Link>
  );
};
