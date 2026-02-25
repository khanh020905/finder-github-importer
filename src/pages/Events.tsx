import { mockEvents } from "@/lib/mock-data";
import { EventCard } from "@/components/finder/EventCard";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";

const Events = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sự kiện</h1>
          <p className="text-muted-foreground text-sm">Hoạt động & sự kiện tại campus</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Tạo sự kiện
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
