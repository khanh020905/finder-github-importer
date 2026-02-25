import { mockGroups } from "@/lib/mock-data";
import { GroupCard } from "@/components/finder/GroupCard";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

const StudyGroups = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nhóm học tập</h1>
          <p className="text-muted-foreground text-sm">Tìm hoặc tạo nhóm học theo môn</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Tạo nhóm
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default StudyGroups;
