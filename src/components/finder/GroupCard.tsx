import type { StudyGroup } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, MapPin, Users } from "lucide-react";

interface GroupCardProps {
  group: StudyGroup;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const isFull = group.members >= group.maxMembers;

  return (
    <div className="bg-card rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">{group.name}</h3>
          <p className="text-xs text-muted-foreground">{group.subject}</p>
        </div>
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground mt-3">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {group.schedule}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {group.location}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> {group.members}/{group.maxMembers} thành viên
        </div>
      </div>
      <Button
        size="sm"
        className={`w-full mt-3 text-xs h-8 ${isFull ? "" : "gradient-secondary border-0 text-secondary-foreground"}`}
        disabled={isFull}
        variant={isFull ? "secondary" : "default"}
      >
        {isFull ? "Đã đầy" : "Tham gia nhóm"}
      </Button>
    </div>
  );
};
