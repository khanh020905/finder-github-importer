import { useState } from "react";
import { mockUsers, mockEvents, mockGroups, type User, type Event, type StudyGroup } from "@/lib/mock-data";
import { UserCard } from "@/components/finder/UserCard";
import { EventCard } from "@/components/finder/EventCard";
import { GroupCard } from "@/components/finder/GroupCard";
import { Users, CalendarDays, BookOpen, Sparkles } from "lucide-react";

const currentUser = mockUsers[0];

const Dashboard = () => {
  const suggestedFriends = mockUsers
    .filter((u) => u.id !== currentUser.id)
    .map((u) => ({
      ...u,
      commonTags: u.interests.filter((i) => currentUser.interests.includes(i)).length,
    }))
    .sort((a, b) => b.commonTags - a.commonTags)
    .slice(0, 4);

  const upcomingEvents = mockEvents.slice(0, 3);
  const activeGroups = mockGroups.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero greeting */}
      <div className="gradient-primary rounded-2xl p-6 md:p-8 text-primary-foreground">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <span className="text-sm font-medium opacity-90">Chào buổi sáng!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          Xin chào, {currentUser.name} 👋
        </h1>
        <p className="opacity-90">Hôm nay bạn muốn kết nối với ai?</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: "Bạn bè gợi ý", count: suggestedFriends.length, color: "text-primary" },
          { icon: CalendarDays, label: "Sự kiện sắp tới", count: upcomingEvents.length, color: "text-secondary" },
          { icon: BookOpen, label: "Nhóm học", count: activeGroups.length, color: "text-accent-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 shadow-card text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Suggested friends */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Bạn bè gợi ý
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedFriends.map((user) => (
            <UserCard key={user.id} user={user} commonTags={user.commonTags} />
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-secondary" />
          Sự kiện sắp tới
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Study groups */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Nhóm học tập
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
