import { useState } from "react";
import { mockEvents } from "@/lib/mock-data";
import { EventCard } from "@/components/finder/EventCard";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CalendarDays,
  Search,
  SlidersHorizontal,
  Sparkles,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Tất cả", "Music", "Workshop", "Sports", "Social", "Study"];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesCategory =
      activeCategory === "Tất cả" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Premium Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-3xl font-black italic font-serif-display text-gradient-flame flex items-center gap-2">
              Sự kiện{" "}
              <Sparkles className="w-6 h-6 text-primary fill-primary/10" />
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 pl-1">
              Khám phá nhịp sống campus
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl gradient-hot text-white flex items-center justify-center shadow-glow border-0"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sự kiện, mini-show, giải đấu..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card border border-border/10 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-soft font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat
                    ? "gradient-hot text-white border-transparent shadow-md"
                    : "bg-card text-muted-foreground border-border/5 hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-1">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={event.id}
              >
                <EventCard event={event} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto opacity-20">
                <CalendarDays className="w-10 h-10" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Không tìm thấy sự kiện nào phù hợp.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-elevated flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-black bg-muted overflow-hidden"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  alt=""
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-white uppercase tracking-wider">
            50+ người đang online
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
