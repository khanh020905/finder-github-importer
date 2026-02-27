import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Camera, Plus, Check, MapPin, Heart, Sparkles, ScanFace } from "lucide-react";
import { interestTags } from "@/lib/mock-data";

const steps = [
  { id: "selfie", title: "Xác minh khuôn mặt" },
  { id: "photos", title: "Thêm ảnh" },
  { id: "basic", title: "Thông tin cơ bản" },
  { id: "interests", title: "Sở thích" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [genderPref, setGenderPref] = useState("");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selfieVerified, setSelfieVerified] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate("/");
  };
  const goBack = () => { if (step > 0) setStep(step - 1); };

  const toggleInterest = (t: string) => {
    setSelectedInterests((p) => p.includes(t) ? p.filter((x) => x !== t) : p.length < 8 ? [...p, t] : p);
  };

  const addPhoto = () => {
    if (photos.length < 6) setPhotos([...photos, `https://picsum.photos/seed/ob${photos.length + 1}/300/400`]);
  };

  const renderStep = () => {
    switch (steps[step].id) {
      case "selfie":
        return (
          <div className="space-y-6 text-center animate-slide-up">
            <div className="w-20 h-20 rounded-3xl gradient-hot flex items-center justify-center mx-auto shadow-glow">
              <ScanFace className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Xác minh Photo</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Chụp selfie để xác minh bạn là người thật. Tăng 30% matches!</p>
            </div>
            {!selfieVerified ? (
              <button onClick={() => setSelfieVerified(true)} className="w-40 h-40 rounded-full border-4 border-dashed border-primary/30 flex flex-col items-center justify-center mx-auto hover:border-primary/60 transition-colors group">
                <Camera className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground mt-2">Chạm để chụp</span>
              </button>
            ) : (
              <div className="animate-scale-in">
                <div className="w-40 h-40 rounded-full gradient-hot flex items-center justify-center mx-auto shadow-glow">
                  <Check className="w-16 h-16 text-white" />
                </div>
                <p className="text-sm font-semibold text-primary mt-4">Đã xác minh! ✓</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Hoặc liên kết Instagram / Facebook để xác minh</p>
          </div>
        );

      case "photos":
        return (
          <div className="space-y-5 animate-slide-up">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Thêm ảnh đẹp nhất</h2>
              <p className="text-sm text-muted-foreground mt-1">Tối đa 6 ảnh · Ảnh đầu là ảnh chính</p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[...Array(6)].map((_, i) => (
                <button key={i} onClick={addPhoto} className={`aspect-[3/4] rounded-2xl overflow-hidden transition-all ${photos[i] ? "shadow-card" : "border-2 border-dashed border-muted-foreground/15 hover:border-primary/30 bg-muted/20"}`}>
                  {photos[i] ? (
                    <div className="relative w-full h-full">
                      <img src={photos[i]} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <div className="absolute bottom-1.5 left-1.5 gradient-hot text-white text-[8px] px-2 py-0.5 rounded-full font-bold">CHÍNH</div>}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                      <Plus className="w-7 h-7" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">💡 Ảnh rõ mặt, tự nhiên nhận được nhiều like hơn 3x</p>
          </div>
        );

      case "basic":
        return (
          <div className="space-y-5 animate-slide-up">
            <h2 className="text-2xl font-bold text-center">Giới thiệu bản thân</h2>
            <div className="space-y-4">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên hiển thị" className="h-13 rounded-2xl bg-muted/40 border-0 text-base focus:ring-2 focus:ring-primary/20" />
              <div className="grid grid-cols-2 gap-2.5">
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Tuổi" min={18} max={50} className="h-13 rounded-2xl bg-muted/40 border-0 focus:ring-2 focus:ring-primary/20" />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-13 rounded-2xl bg-muted/40 border-0 px-4 text-sm focus:ring-2 focus:ring-primary/20">
                  <option value="">Giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Muốn tìm</p>
                <div className="flex gap-2">
                  {([["male","Nam 👨"],["female","Nữ 👩"],["all","Tất cả 💫"]] as const).map(([v,l]) => (
                    <button key={v} onClick={() => setGenderPref(v)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${genderPref === v ? "gradient-hot text-white shadow-card" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-sm font-semibold">Bio</span><span className="text-xs text-muted-foreground">{bio.length}/300</span></div>
                <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 300))} placeholder="Chia sẻ vài điều thú vị về bạn..." className="w-full h-24 rounded-2xl bg-muted/40 border-0 p-4 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none" />
              </div>
            </div>
          </div>
        );

      case "interests":
        return (
          <div className="space-y-5 animate-slide-up">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Chọn sở thích</h2>
              <p className="text-sm text-muted-foreground mt-1">Chọn 5–8 để tìm người hợp ý</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {interestTags.map((tag) => {
                const sel = selectedInterests.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleInterest(tag)} className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${sel ? "gradient-hot text-white shadow-card scale-[1.03]" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}>
                    {tag} {sel && "✓"}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-center text-muted-foreground">Đã chọn <span className="text-primary font-bold">{selectedInterests.length}</span>/8</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={goBack} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${step === 0 ? "opacity-0 pointer-events-none" : "bg-muted hover:bg-muted/80"}`}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-bold"><span className="font-serif-display italic">Campus</span>Connect</span>
          </div>
          <button onClick={goNext} className="text-xs text-muted-foreground font-medium hover:text-primary">Bỏ qua</button>
        </div>
        {/* Progress */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full gradient-hot rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 max-w-md mx-auto w-full overflow-y-auto">{renderStep()}</div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background/85 backdrop-blur-xl px-5 py-4 border-t border-border/30">
        <Button onClick={goNext} className="w-full h-[52px] rounded-2xl gradient-hot border-0 text-white font-semibold text-base shadow-elevated hover:shadow-glow transition-all active:scale-[0.98]">
          {step === steps.length - 1 ? <><Sparkles className="w-4 h-4 mr-2" /> Bắt đầu Swipe!</> : <>Tiếp <ArrowRight className="w-4 h-4 ml-2" /></>}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
