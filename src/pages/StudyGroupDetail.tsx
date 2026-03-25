import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockGroups, type StudyGroup } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Clock,
  Users,
  BookOpen,
  MessageCircle,
  Share2,
  Star,
  FileText,
  Download,
  Calendar,
  Wifi,
  Shield,
  Send,
  Loader2,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const levelColors: Record<string, string> = {
  Beginner: "from-green-500 to-emerald-500",
  Intermediate: "from-blue-500 to-indigo-500",
  Advanced: "from-purple-500 to-pink-500",
};

const levelLabels: Record<string, string> = {
  Beginner: "Cơ bản",
  Intermediate: "Trung cấp",
  Advanced: "Nâng cao",
};

interface GroupMessage {
  id: string;
  content: string;
  type: string;
  image_url?: string;
  created_at: string;
  sender_id: string;
  profiles?: { name: string; avatar_url: string } | null;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: { name: string; avatar_url: string } | null;
}

const StudyGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"about" | "discussion" | "members">("about");
  const [newMessage, setNewMessage] = useState("");
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDbGroup = id ? !id.startsWith("g") : false;

  // Load group data
  useEffect(() => {
    const mockGroup = mockGroups.find((g) => g.id === id);
    if (mockGroup) {
      setGroup(mockGroup);
      setLoading(false);
      return;
    }

    const fetchGroup = async () => {
      try {
        const { data, error } = await supabase
          .from("study_groups")
          .select("*, profiles:created_by(name, avatar_url)")
          .eq("id", id)
          .single();

        if (!error && data) {
          setGroup({
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
              name: data.profiles?.name || "Ẩn danh",
              avatar: data.profiles?.avatar_url || data.id,
            },
            tags: data.tags || [],
            level: data.level || "Beginner",
            isOnline: data.is_online || false,
            rating: data.rating || 5.0,
            nextSession: data.next_session || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.log("[StudyGroupDetail] Fetch error:", err);
      }
      setLoading(false);
    };

    fetchGroup();
  }, [id]);

  // Check membership + load members + messages (only for DB groups)
  useEffect(() => {
    if (!isDbGroup || !user || !id) return;

    const loadGroupData = async () => {
      // Check if user is a member
      const { data: memberData } = await supabase
        .from("study_group_members")
        .select("*")
        .eq("group_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      setIsMember(!!memberData);

      // Load members
      const { data: membersData } = await supabase
        .from("study_group_members")
        .select("*, profiles:user_id(name, avatar_url)")
        .eq("group_id", id)
        .order("joined_at", { ascending: true });

      if (membersData) setMembers(membersData);

      // Load messages
      const { data: messagesData } = await supabase
        .from("study_group_messages")
        .select("*, profiles:sender_id(name, avatar_url)")
        .eq("group_id", id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (messagesData) setMessages(messagesData);
    };

    loadGroupData();

    // Realtime messages
    const channel = supabase
      .channel(`group-chat-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "study_group_messages", filter: `group_id=eq.${id}` },
        async (payload) => {
          const { data: msgWithProfile } = await supabase
            .from("study_group_messages")
            .select("*, profiles:sender_id(name, avatar_url)")
            .eq("id", payload.new.id)
            .single();

          if (msgWithProfile) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msgWithProfile.id)) return prev;
              return [...prev, msgWithProfile];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "study_group_members", filter: `group_id=eq.${id}` },
        async () => {
          const { data: membersData } = await supabase
            .from("study_group_members")
            .select("*, profiles:user_id(name, avatar_url)")
            .eq("group_id", id)
            .order("joined_at", { ascending: true });
          if (membersData) setMembers(membersData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDbGroup, user, id]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = async () => {
    if (!user || !id) return;
    setJoining(true);

    const { error } = await supabase
      .from("study_group_members")
      .insert({ group_id: id, user_id: user.id, role: "member" });

    if (!error) {
      setIsMember(true);
      // Increment member count
      await supabase.rpc("increment_study_group_members", { gid: id }).catch(() => {
        // If RPC doesn't exist, update directly
        supabase.from("study_groups").update({ members: (group?.members || 0) + 1 }).eq("id", id).then();
      });
      // Send system message
      await supabase.from("study_group_messages").insert({
        group_id: id,
        sender_id: user.id,
        content: `${profile?.name || "Người dùng"} đã tham gia nhóm 🎉`,
        type: "system",
      });
      toast({ title: "🎓 Đã tham gia!", description: `Chào mừng bạn đến ${group?.name}!`, className: "bg-secondary text-white border-none" });
    } else {
      toast({ title: "❌ Lỗi", description: error.message, variant: "destructive" });
    }
    setJoining(false);
  };

  const handleLeave = async () => {
    if (!user || !id) return;
    await supabase.from("study_group_members").delete().eq("group_id", id).eq("user_id", user.id);
    setIsMember(false);
    toast({ title: "👋 Đã rời nhóm", description: "Bạn có thể tham gia lại bất cứ lúc nào." });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !id) return;
    setSending(true);

    const { error } = await supabase.from("study_group_messages").insert({
      group_id: id,
      sender_id: user.id,
      content: newMessage.trim(),
      type: "text",
    });

    if (!error) setNewMessage("");
    setSending(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !id) return;
    setUploadingImage(true);

    const ext = file.name.split(".").pop();
    const filePath = `group-chat/${id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "❌ Upload lỗi", description: uploadError.message, variant: "destructive" });
      setUploadingImage(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await supabase.from("study_group_messages").insert({
      group_id: id,
      sender_id: user.id,
      content: "📷 Ảnh",
      type: "image",
      image_url: urlData.publicUrl,
    });

    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy nhóm</h2>
        <Button onClick={() => navigate("/study-groups")} variant="outline">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isFull = group.members >= group.maxMembers;
  const spotsLeft = group.maxMembers - group.members;
  const fillPercent = (group.members / group.maxMembers) * 100;

  const nextDate = new Date(group.nextSession);
  const formattedNext = nextDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const tabs = [
    { key: "about", label: "Tổng quan", icon: BookOpen },
    { key: "discussion", label: "Trò chuyện", icon: MessageCircle },
    { key: "members", label: `Thành viên (${isDbGroup ? members.length : group.members})`, icon: Users },
  ] as const;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className={`relative w-full h-[28vh] rounded-b-[2.5rem] overflow-hidden shadow-soft mb-6 bg-gradient-to-br ${levelColors[group.level] || levelColors.Beginner}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
        
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between safe-area-top">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {isMember && (
              <button onClick={handleLeave} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/50 transition-all" title="Rời nhóm">
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-center leading-tight drop-shadow-md tracking-tight">
            {group.name}
          </h1>
          <p className="text-xs font-bold mt-1.5 text-white/80 uppercase tracking-widest">
            {group.subject}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {group.isOnline && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider">
                <Wifi className="w-3 h-3" /> Online
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider">
              {levelLabels[group.level] || group.level}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-white/80" /> {group.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/5 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Lịch học</p>
              <p className="font-bold text-xs">{group.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/5 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Địa điểm</p>
              <p className="font-bold text-xs">{group.location}</p>
            </div>
          </div>
        </div>

        {/* Tab Navs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-wider ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border/5 shadow-soft">
              <h3 className="text-base font-black mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" /> Về nhóm này
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{group.description}</p>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/5 shadow-soft">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted ring-2 ring-secondary/20">
                <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${group.createdBy.avatar}&backgroundColor=ffd5dc`} alt="" className="w-full h-full" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{group.createdBy.name}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Quản trị viên nhóm</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black">
                <Shield className="w-3 h-3" /> Admin
              </div>
            </div>

            {/* Next session */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
              <Calendar className="w-5 h-5 text-secondary shrink-0" />
              <div>
                <p className="text-[9px] uppercase font-bold text-secondary tracking-widest">Buổi học tiếp theo</p>
                <p className="font-bold text-sm">{formattedNext}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs">{tag}</span>
              ))}
            </div>

            {/* Progress */}
            <div className="p-4 rounded-2xl bg-card border border-border/5 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" /> Thành viên
                </p>
                <span className="text-sm font-bold">
                  <span className="text-secondary">{isDbGroup ? members.length : group.members}</span> / {group.maxMembers}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : "bg-gradient-to-r from-blue-500 to-purple-500"}`} style={{ width: `${fillPercent}%` }} />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "discussion" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {!isDbGroup ? (
              <div className="p-8 rounded-2xl bg-card border border-border/5 shadow-soft text-center space-y-3">
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground text-sm">Tính năng trò chuyện chỉ khả dụng cho nhóm do người dùng tạo.</p>
              </div>
            ) : !isMember ? (
              <div className="p-8 rounded-2xl bg-card border border-border/5 shadow-soft text-center space-y-3">
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground text-sm">Tham gia nhóm để bắt đầu trò chuyện</p>
                <Button onClick={handleJoin} disabled={joining} className="gradient-secondary text-white rounded-2xl font-bold">
                  {joining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Tham gia ngay
                </Button>
              </div>
            ) : (
              <>
                {/* Chat messages */}
                <div className="p-4 rounded-2xl bg-card border border-border/5 shadow-soft min-h-[300px] max-h-[50vh] overflow-y-auto space-y-3">
                  {messages.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện! 💬
                    </p>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    const isSystem = msg.type === "system";

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center">
                          <span className="text-[10px] text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-muted shrink-0 mt-1">
                            <img src={msg.profiles?.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${msg.sender_id}&backgroundColor=ffd5dc`} alt="" className="w-full h-full" />
                          </div>
                        )}
                        <div className={`max-w-[70%] ${isMe ? "items-end" : ""}`}>
                          {!isMe && (
                            <p className="text-[10px] font-bold text-muted-foreground mb-0.5 ml-1">
                              {msg.profiles?.name || "Ẩn danh"}
                            </p>
                          )}
                          <div className={`px-3 py-2 rounded-2xl text-sm ${
                            isMe
                              ? "bg-secondary text-white rounded-br-md"
                              : "bg-muted/50 text-foreground rounded-bl-md"
                          }`}>
                            {msg.type === "image" && msg.image_url ? (
                              <img src={msg.image_url} alt="Ảnh" className="rounded-xl max-w-full max-h-48 object-cover" />
                            ) : (
                              msg.content
                            )}
                          </div>
                          <p className={`text-[9px] text-muted-foreground mt-0.5 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                            {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Message input */}
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-12 h-12 rounded-2xl bg-card border border-border/10 flex items-center justify-center text-muted-foreground hover:text-secondary transition-colors shrink-0"
                  >
                    {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                  </button>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Viết tin nhắn..."
                    className="flex-1 h-12 px-4 rounded-2xl bg-card border border-border/10 text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="w-12 h-12 rounded-2xl gradient-secondary text-white flex items-center justify-center shadow-glow-secondary disabled:opacity-50 shrink-0"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "members" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-card border border-border/5 shadow-soft">
            <h3 className="text-base font-black mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" /> Thành viên
            </h3>
            {isDbGroup && members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-muted">
                      <img src={member.profiles?.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${member.user_id}&backgroundColor=ffd5dc`} alt="" className="w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold">{member.profiles?.name || "Ẩn danh"}</span>
                      {member.role === "admin" && (
                        <span className="text-[9px] font-black ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">Admin</span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(member.joined_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: Math.min(group.members, 5) }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-muted">
                      <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${group.id}${i}&backgroundColor=ffd5dc`} alt="" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold">{i === 0 ? group.createdBy.name : `Thành viên ${i + 1}`}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">{i === 0 ? "Admin" : "Member"}</span>
                    </div>
                  </div>
                ))}
                {group.members > 5 && (
                  <p className="text-xs text-muted-foreground font-medium pl-12">+{group.members - 5} thành viên khác</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Join / Leave Button */}
        {isDbGroup && (
          <div className="space-y-3 pt-2">
            {isMember ? (
              <div className="flex gap-3">
                <Button onClick={() => setActiveTab("discussion")} className="flex-1 h-14 rounded-[1.25rem] font-black text-sm uppercase tracking-widest gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95 transition-all">
                  💬 Trò chuyện
                </Button>
                <Button onClick={handleLeave} variant="outline" className="h-14 rounded-[1.25rem] font-black text-sm uppercase tracking-widest px-6">
                  Rời nhóm
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleJoin}
                disabled={isFull || joining}
                className={`w-full h-14 rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all ${
                  isFull ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95"
                }`}
              >
                {joining ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isFull ? "Nhóm đã đầy" : "Tham gia nhóm ngay"}
              </Button>
            )}
            {!isMember && !isFull && spotsLeft <= 3 && (
              <p className="text-center text-xs text-orange-500 font-bold animate-pulse">
                Chỉ còn {spotsLeft} chỗ cuối cùng!
              </p>
            )}
          </div>
        )}

        {/* Mock groups join button */}
        {!isDbGroup && (
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => {
                toast({ title: "🎓 Đã tham gia nhóm!", description: `Bạn đã tham gia ${group.name}.`, className: "bg-secondary text-white border-none" });
              }}
              disabled={isFull}
              className={`w-full h-14 rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all ${
                isFull ? "bg-muted text-muted-foreground" : "gradient-secondary text-white shadow-glow-secondary hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isFull ? "Nhóm đã đầy" : "Tham gia nhóm ngay"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGroupDetail;
