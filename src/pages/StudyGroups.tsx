import { useState } from "react";
import { mockGroups } from "@/lib/mock-data";
import { GroupCard } from "@/components/finder/GroupCard";
import { Button } from "@/components/ui/button";
import {
  Plus,
  BookOpen,
  Search,
  GraduationCap,
  LayoutGrid,
  ListFilter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Tất cả",
  "Exam Prep",
  "Language",
  "Project",
  "Coding",
  "Arts",
];

const StudyGroups = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = mockGroups.filter((group) => {
    const matchesCategory =
      activeCategory === "Tất cả" || group.category === activeCategory;
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Collaborative Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-3xl font-black italic font-serif-display text-gradient-blue flex items-center gap-2">
              Nhóm học tập{" "}
              <GraduationCap className="w-8 h-8 text-secondary fill-secondary/10" />
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 pl-1">
              Học nhóm hiệu quả, bứt phá GPA
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-glow-secondary border-0"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Tactical Search & Filters */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-secondary transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo môn học, tên nhóm hoặc đề tài..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none shadow-soft font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
            <button className="h-10 px-4 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <ListFilter className="w-4 h-4" />
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat
                    ? "bg-secondary text-white border-transparent shadow-md"
                    : "bg-card text-muted-foreground border-border/5 hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
        <AnimatePresence mode="popLayout">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={group.id}
              >
                <GroupCard group={group} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center space-y-4"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-secondary/5 flex items-center justify-center mx-auto">
                <BookOpen className="w-10 h-10 text-secondary/30" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Chưa tìm thấy nhóm nào</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo nhóm học của riêng
                  bạn!
                </p>
              </div>
              <Button
                variant="secondary"
                className="rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest shadow-glow-secondary"
              >
                Tạo nhóm ngay
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Stats */}
      <div className="grid grid-cols-2 gap-4 mt-12 bg-card/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-border/5">
        <div className="text-center space-y-1">
          <p className="text-3xl font-black text-secondary">150+</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Nhóm hoạt động
          </p>
        </div>
        <div className="text-center space-y-1 border-l border-border/10">
          <p className="text-3xl font-black text-primary">800+</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Sinh viên tham gia
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyGroups;
