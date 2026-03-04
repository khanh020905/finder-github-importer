import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  MapPin,
  Heart,
  Briefcase,
  User,
  Shield,
  Verified,
  Camera,
  Settings,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  Bell,
  Lock,
  Eye,
  HelpCircle,
  ScanFace,
  Save,
  X,
  CreditCard,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const interestTags = [
  "Âm nhạc",
  "Du lịch",
  "Thể thao",
  "Đọc sách",
  "Nấu ăn",
  "Chụp ảnh",
  "Phim ảnh",
  "Game",
  "Khiêu vũ",
  "Yoga",
  "Cắm trại",
  "Cafe",
  "Mèo",
  "Chó",
  "Nghệ thuật",
  "Kinh doanh",
  "Công nghệ",
  "Thời trang",
  "Hiking",
  "Tình nguyện",
];

const Profile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Edit form state
  const [editName, setEditName] = useState(profile?.name || "");
  const [editAge, setEditAge] = useState(profile?.age?.toString() || "");
  const [editBio, setEditBio] = useState(profile?.bio || "");
  const [editGender, setEditGender] = useState(profile?.gender || "");
  const [editGenderPref, setEditGenderPref] = useState(
    profile?.gender_preference || "",
  );
  const [editInterests, setEditInterests] = useState<string[]>(
    profile?.interests || [],
  );
  const [editCity, setEditCity] = useState(profile?.city || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Real stats from DB
  const [realStats, setRealStats] = useState({ matches: 0, likes: 0 });
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count: matchCount } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .or(`user1.eq.${user.id},user2.eq.${user.id}`);
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("to_user", user.id);
      setRealStats({ matches: matchCount || 0, likes: likeCount || 0 });
    };
    fetchStats();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `avatar-${user.id}.${ext}`;

      // Upload file (upsert to overwrite previous avatar)
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      // Use signed URL (works even if bucket is not public)
      const { data: signedData, error: signErr } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 year expiry

      if (signErr || !signedData?.signedUrl) {
        throw signErr || new Error("Không thể tạo URL ảnh");
      }

      const avatarUrl = signedData.signedUrl;
      console.log("Avatar URL:", avatarUrl);

      // Update profile with new avatar URL
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateErr) throw updateErr;

      await refreshProfile();
      toast({ title: "Đã cập nhật ảnh đại diện! 📸" });
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      toast({
        title: "Lỗi tải ảnh",
        description: err?.message || "Không thể tải ảnh lên",
        variant: "destructive",
      });
    }
    setUploadingAvatar(false);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const completionPercent = useMemo(() => {
    if (!profile) return 0;
    let points = 0;
    if (profile.name) points += 20;
    if (profile.avatar_url) points += 20;
    if (profile.bio) points += 20;
    if (profile.interests?.length > 0) points += 20;
    if (profile.age) points += 20;
    return points;
  }, [profile]);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const startEditing = () => {
    setEditName(profile?.name || "");
    setEditAge(profile?.age?.toString() || "");
    setEditBio(profile?.bio || "");
    setEditGender(profile?.gender || "");
    setEditGenderPref(profile?.gender_preference || "");
    setEditInterests(profile?.interests || []);
    setEditCity(profile?.city || "");
    setEditing(true);
  };

  const toggleInterest = (t: string) => {
    setEditInterests((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : p.length < 8 ? [...p, t] : p,
    );
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!editName.trim()) {
      toast({
        title: "⚠️ Tên không được để trống",
        description: "Vui lòng nhập tên hiển thị của bạn.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: editName.trim(),
        age: editAge ? parseInt(editAge) : null,
        bio: editBio.trim(),
        gender: editGender || null,
        gender_preference: editGenderPref || null,
        interests: editInterests,
        city: editCity.trim(),
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Đã lưu! ✅" });
      await refreshProfile();
      setEditing(false);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Use profile directly, or fallback to show page immediately
  const displayProfile = profile || {
    id: user?.id || "",
    name: user?.email?.split("@")[0] || "User",
    age: null,
    gender: null,
    gender_preference: null,
    bio: "",
    avatar_url: "",
    photos: [] as string[],
    interests: [] as string[],
    occupation: "",
    university: "",
    city: "",
    lat: null,
    lng: null,
    is_verified: false,
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const avatarUrl =
    displayProfile.avatar_url ||
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.id}&backgroundColor=ffd5dc`;

  return (
    <div className="space-y-6 animate-fade-in pb-24 max-w-md mx-auto">
      {/* Header Profile Section */}
      <div className="relative pt-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-card shadow-romantic group-hover:scale-105 transition-transform duration-500">
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl gradient-hot text-white border-2 border-card shadow-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
              {uploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
            {displayProfile.is_verified && (
              <div className="absolute top-0 -right-2 w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center border border-superblue-100">
                <Verified className="w-5 h-5 text-superblue-500 fill-white" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black italic font-serif-display items-center justify-center flex gap-1.5">
              {displayProfile.name ||
                user?.email?.split("@")[0] ||
                "Chưa đặt tên"}
              {displayProfile.age && `, ${displayProfile.age}`}
            </h2>
            {!displayProfile.name && (
              <p className="text-xs text-primary font-bold mt-1 animate-pulse">
                ⚠️ Hãy cập nhật tên của bạn để hiển thị trên Khám phá
              </p>
            )}
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
              {[
                displayProfile.university,
                displayProfile.occupation,
                displayProfile.city,
              ]
                .filter(Boolean)
                .join(" • ") || "Chưa cập nhật thông tin"}
            </p>
          </div>
        </div>
      </div>

      {/* Completion Tracker */}
      <div className="mx-1 p-5 rounded-3xl bg-card border border-border/5 shadow-soft space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-black uppercase tracking-wider">
            Hồ sơ đã hoàn tất {completionPercent}%
          </h4>
          <span className="text-[10px] font-bold text-primary animate-pulse">
            NHẬN THÊM LƯỢT THÍCH →
          </span>
        </div>
        <Progress
          value={completionPercent}
          className="h-2.5 rounded-full bg-primary/10"
        />
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-3 mx-1">
        {[
          {
            label: "Matches",
            value: realStats.matches.toString(),
            icon: Target,
            color: "text-red-500",
          },
          {
            label: "Likes",
            value:
              realStats.likes > 999
                ? `${(realStats.likes / 1000).toFixed(1)}k`
                : realStats.likes.toString(),
            icon: Heart,
            color: "text-pink-500",
          },
          { label: "Views", value: "—", icon: Eye, color: "text-purple-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card p-4 rounded-3xl border border-border/5 shadow-soft text-center group hover:shadow-card transition-all"
          >
            <div
              className={`w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-lg font-black">{stat.value}</div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mx-1">
        <button
          onClick={startEditing}
          className="flex items-center justify-center gap-2 rounded-3xl h-14 font-bold shadow-soft bg-card border border-border/10 hover:bg-muted/80 transition-all active:scale-[0.97] text-sm"
        >
          <Edit className="w-4 h-4 text-primary" />
          <span>CHỈNH SỬA</span>
        </button>
        <button className="flex items-center justify-center gap-2 rounded-3xl h-14 font-bold gradient-gold text-white shadow-glow border-0 hover:scale-105 active:scale-95 transition-all text-sm">
          <Zap className="w-4 h-4 fill-white" />
          <span>CỰC PHẨM</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4">
            Tài khoản & Bảo mật
          </h4>
          <div className="bg-card rounded-[2rem] border border-border/5 shadow-soft overflow-hidden mx-1 divide-y divide-border/5">
            {/* i18n Language Switcher */}
            <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/10 space-y-4">
              <div className="flex items-center gap-3 mb-2 px-1">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight leading-none text-foreground">
                    Ngôn ngữ / Language
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    Hiển thị giao diện
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleLanguageChange("vi")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all ${
                    i18n.language === "vi"
                      ? "bg-primary text-white shadow-glow ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all ${
                    i18n.language === "en"
                      ? "bg-primary text-white shadow-glow ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <button
              onClick={toggleDark}
              className="w-full flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                  {dark ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <span className="text-sm font-bold tracking-tight">
                  {dark ? "Chế độ tối" : "Chế độ sáng"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>

            {[
              {
                icon: Shield,
                label: "Quyền riêng tư",
                color: "text-superblue-500",
              },
              { icon: Bell, label: "Thông báo", color: "text-red-500" },
              {
                icon: CreditCard,
                label: "Quản lý gói Gold",
                color: "text-amber-500",
              },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4">
            Khác
          </h4>
          <div className="bg-card rounded-[2rem] border border-border/5 shadow-soft overflow-hidden mx-1 divide-y divide-border/5">
            {[
              { icon: HelpCircle, label: "Hỗ trợ & Trợ giúp" },
              { icon: Lock, label: "Chính sách bảo mật" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 px-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group text-red-500"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-sm font-black tracking-tight uppercase">
                  Đăng xuất
                </span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[9px] font-bold text-muted-foreground/50 text-center uppercase tracking-widest pt-4">
        Version 1.0.4 • {user?.email}
      </p>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-card rounded-t-[3rem] sm:rounded-[3rem] p-8 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-6 shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-black italic font-serif-display">
                    Edit Profile
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Làm mới bản thân để nổi bật hơn
                  </p>
                </div>
                <button
                  onClick={() => setEditing(false)}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 px-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Họ & Tên
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tên hiển thị"
                    className="h-14 rounded-2xl bg-muted/40 border-0 px-6 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 px-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Tuổi
                    </label>
                    <Input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      placeholder="Tuổi"
                      min={18}
                      max={50}
                      className="h-14 rounded-2xl bg-muted/40 border-0 px-6 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5 px-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Giới tính
                    </label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full h-14 rounded-2xl bg-muted/40 border-0 px-6 text-sm font-bold appearance-none"
                    >
                      <option value="">Chọn...</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 px-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Thành phố
                  </label>
                  <Input
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="Nơi ở hiện tại"
                    className="h-14 rounded-2xl bg-muted/40 border-0 px-6 font-bold"
                  />
                </div>

                <div className="space-y-1.5 px-1">
                  <div className="flex justify-between items-center ml-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Giới thiệu bản thân
                    </label>
                    <span className="text-[9px] font-bold text-muted-foreground">
                      {editBio.length}/150
                    </span>
                  </div>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value.slice(0, 150))}
                    placeholder="Kể câu chuyện của bạn..."
                    className="w-full h-28 rounded-2xl bg-muted/40 border-0 p-5 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium leading-relaxed"
                  />
                </div>

                <div className="space-y-3 px-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Muốn tìm kiếm
                  </label>
                  <div className="flex gap-2">
                    {(
                      [
                        ["male", "Nam"],
                        ["female", "Nữ"],
                        ["all", "Tất cả"],
                      ] as const
                    ).map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => setEditGenderPref(v)}
                        className={`flex-1 h-12 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all ${editGenderPref === v ? "gradient-hot text-white shadow-glow" : "bg-muted/40 text-muted-foreground"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 px-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Sở thích ({editInterests.length}/8)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 scrollbar-none">
                    {interestTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all ${editInterests.includes(tag) ? "gradient-hot text-white shadow-sm" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={saveProfile}
                disabled={saving}
                className="w-full h-16 rounded-3xl gradient-hot border-0 text-white font-black text-lg shadow-glow mt-4"
              >
                {saving ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {" "}
                    <Save className="w-5 h-5 mr-2" /> CẬP NHẬT HỒ SƠ{" "}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
