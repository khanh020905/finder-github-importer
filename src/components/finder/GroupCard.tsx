import type { StudyGroup } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface GroupCardProps {
  group: StudyGroup;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const isFull = group.members >= group.maxMembers;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card rounded-[2rem] p-6 shadow-soft border border-border/5 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 shadow-inner">
          <GraduationCap className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 className="font-bold text-base tracking-tight">{group.name}</h3>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
            {group.subject}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
        {group.description ||
          "Cùng nhau học tập và chia sẻ kiến thức để đạt kết quả tốt nhất!"}
      </p>

      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{group.schedule}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{group.location}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5" />
            <span>
              {group.members}/{group.maxMembers}
            </span>
          </div>
        </div>
      </div>

      <Button
        disabled={isFull}
        className={`w-full mt-6 rounded-2xl h-11 font-black text-xs uppercase tracking-widest transition-all ${isFull ? "bg-muted" : "gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95"}`}
      >
        {isFull ? "Nhóm đã đầy" : "Tham gia nhóm ngay"}
        {!isFull && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </motion.div>
  );
};
