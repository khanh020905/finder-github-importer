import type { Event } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const spotsLeft = event.maxParticipants - event.participants;
  const isFull = spotsLeft <= 0;

  return (
    <div className="bg-card rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow">
      <h3 className="font-semibold text-sm mb-2">{event.title}</h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-secondary" />
          {event.date} · {event.time}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          {event.location}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {event.participants}/{event.maxParticipants} người
        </div>
      </div>
      <Button
        size="sm"
        className={`w-full mt-3 text-xs h-8 ${isFull ? "" : "gradient-primary border-0 text-primary-foreground"}`}
        disabled={isFull}
        variant={isFull ? "secondary" : "default"}
      >
        {isFull ? "Đã đầy" : "Tham gia"}
      </Button>
    </div>
  );
};
