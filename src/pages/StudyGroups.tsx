import { useState, useEffect } from "react";
import { mockGroups, type StudyGroup } from "@/lib/mock-data";
import { GroupCard } from "@/components/finder/GroupCard";
import { Button } from "@/components/ui/button";
import {
  Plus,
  BookOpen,
  Search,
  GraduationCap,
  ListFilter,
  X,
  MapPin,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const categories = [
  "Tất cả",
  "Exam Prep",
  "Language",
  "Project",
  "Coding",
  "Arts",
];

const StudyGroups = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groups, setGroups] = useState<StudyGroup[]>(mockGroups);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    category: "Exam Prep",
    location: "",
    schedule: "",
    maxMembers: "10",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    isOnline: false,
  });

  // Fetch groups from Supabase
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data, error } = await supabase
          .from("study_groups")
          .select("*, profiles:created_by(name, avatar_url)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const dbGroups: StudyGroup[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            subject: row.subject,
            description: row.description || "",
            location: row.location || "",
            schedule: row.schedule || "",
            members: row.members || 1,
            maxMembers: row.max_members || 10,
            category: row.category || "Exam Prep",
            createdBy: {
              name: row.profiles?.name || "Ẩn danh",
              avatar: row.profiles?.avatar_url || row.id,
            },
            tags: row.tags || [],
            level: row.level || "Beginner",
            isOnline: row.is_online || false,
            rating: row.rating || 5.0,
            nextSession: row.next_session || new Date().toISOString(),
          }));
          setGroups([...dbGroups, ...mockGroups]);
        }
      } catch (err) {
        console.log("[StudyGroups] DB fetch skipped:", err);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) => {
    const matchesCategory =
      activeCategory === "Tất cả" || group.category === activeCategory;
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Fixed stats as requested
  const statsGroups = 10;
  const statsStudents = 105;
  const statsSessions = 24;

  const handleCreateGroup = async () => {
    if (!formData.name || !formData.subject) {
      toast({ title: "⚠️ Thiếu thông tin", description: "Vui lòng nhập tên nhóm và môn học." });
      return;
    }

    if (!user) {
      toast({ title: "⚠️ Chưa đăng nhập", description: "Bạn cần đăng nhập để tạo nhóm." });
      return;
    }

    setCreating(true);

    const newGroup = {
      name: formData.name,
      subject: formData.subject,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      schedule: formData.schedule,
      max_members: parseInt(formData.maxMembers) || 10,
      members: 1,
      level: formData.level,
      is_online: formData.isOnline,
      tags: formData.subject.split(/[,\s]+/).filter(Boolean).slice(0, 3),
      rating: 5.0,
      next_session: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("study_groups")
      .insert(newGroup)
      .select("*, profiles:created_by(name, avatar_url)")
      .single();

    setCreating(false);

    if (error) {
      console.error("[StudyGroups] Create error:", error);
      toast({
        title: "❌ Lỗi",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Add the new group to the list
    const createdGroup: StudyGroup = {
      id: data.id,
      name: data.name,
      subject: data.subject,
      description: data.description || "",
      location: data.location || "",
      schedule: data.schedule || "",
      members: data.members || 1,
      maxMembers: data.max_members || 10,
      category: data.category || "Exam Prep",
      createdBy: {
        name: data.profiles?.name || profile?.name || "Ẩn danh",
        avatar: data.profiles?.avatar_url || data.id,
      },
      tags: data.tags || [],
      level: data.level || "Beginner",
      isOnline: data.is_online || false,
      rating: data.rating || 5.0,
      nextSession: data.next_session || new Date().toISOString(),
    };

    setGroups((prev) => [createdGroup, ...prev]);

    toast({
      title: "🎓 Tạo nhóm thành công!",
      description: `Nhóm "${formData.name}" đã được tạo.`,
      className: "bg-secondary text-white border-none",
    });

    setShowCreateModal(false);
    setFormData({
      name: "",
      subject: "",
      description: "",
      category: "Exam Prep",
      location: "",
      schedule: "",
      maxMembers: "10",
      level: "Beginner",
      isOnline: false,
    });
  };

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
            onClick={() => setShowCreateModal(true)}
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

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {/* Grid of Groups */}
      {!loading && (
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
                  onClick={() => setShowCreateModal(true)}
                  variant="secondary"
                  className="rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest shadow-glow-secondary"
                >
                  Tạo nhóm ngay
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Info Stats */}
      <div className="grid grid-cols-3 gap-4 mt-12 bg-card/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-border/5">
        <div className="text-center space-y-1">
          <p className="text-3xl font-black text-secondary">{statsGroups}+</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Nhóm hoạt động
          </p>
        </div>
        <div className="text-center space-y-1 border-l border-border/10">
          <p className="text-3xl font-black text-primary">{statsStudents}+</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Sinh viên tham gia
          </p>
        </div>
        <div className="text-center space-y-1 border-l border-border/10">
          <p className="text-3xl font-black text-amber-500">{statsSessions}+</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Phiên học tuần này
          </p>
        </div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-md rounded-3xl p-6 shadow-elevated border border-border/10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                  Tạo nhóm mới
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    Tên nhóm *
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nhóm Ôn Thi Giải Tích"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    Môn học *
                  </label>
                  <input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="VD: Toán Cao Cấp"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                      Thể loại
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                    >
                      {categories.filter((c) => c !== "Tất cả").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                      Trình độ
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                    >
                      <option value="Beginner">Cơ bản</option>
                      <option value="Intermediate">Trung cấp</option>
                      <option value="Advanced">Nâng cao</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Địa điểm
                    </label>
                    <input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="VD: Thư viện tầng 2"
                      className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                      placeholder="10"
                      className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Lịch học
                  </label>
                  <input
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="VD: Thứ 2, 4 (18:00)"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <input
                    type="checkbox"
                    checked={formData.isOnline}
                    onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                    className="w-4 h-4 rounded accent-secondary"
                  />
                  <label className="text-sm font-medium">Nhóm học online (Google Meet, Zoom...)</label>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về nhóm..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none font-medium resize-none"
                  />
                </div>

                <Button
                  onClick={handleCreateGroup}
                  disabled={creating}
                  className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {creating ? "Đang tạo..." : "Tạo nhóm ngay"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyGroups;
