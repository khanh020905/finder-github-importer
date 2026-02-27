import { mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Heart, Briefcase, User, Shield, Verified, Camera, Settings, Moon, Sun, ChevronRight, LogOut, Bell, Lock, Eye, HelpCircle, Music, Instagram, Globe, ScanFace } from "lucide-react";
import { useState } from "react";

const me = mockUsers[0];

const Profile = () => {
  const [isDark, setIsDark] = useState(false);
  const [tab, setTab] = useState<"profile" | "settings">("profile");
  const [pi, setPi] = useState(0);

  const toggleDark = () => { setIsDark(!isDark); document.documentElement.classList.toggle("dark"); };

  // ── Settings ──
  if (tab === "settings") {
    return (
      <div className="space-y-4 animate-fade-in max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setTab("profile")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80"><ChevronRight className="w-4 h-4 rotate-180" /></button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        {/* Account */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <h3 className="text-[10px] font-bold text-muted-foreground px-4 pt-4 pb-2 uppercase tracking-wider">Account</h3>
          {[{icon:User,label:"Edit Profile",c:"text-primary"},{icon:Lock,label:"Change Password",c:"text-primary"},{icon:Bell,label:"Notifications",c:"text-primary"},{icon:Eye,label:"Privacy",c:"text-primary"},{icon:ScanFace,label:"Photo Verification",c:"text-[#00D4FF]"},{icon:Globe,label:"Passport™ Mode",c:"text-[#667eea]"}].map(({icon:I,label,c}) => (
            <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors text-left"><I className={`w-4 h-4 ${c}`} /><span className="text-[13px] flex-1">{label}</span><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
          ))}
        </div>
        {/* Discovery */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <h3 className="text-[10px] font-bold text-muted-foreground px-4 pt-4 pb-2 uppercase tracking-wider">Discovery</h3>
          <div className="px-4 py-3 space-y-4">
            <div className="flex justify-between"><span className="text-[13px]">Looking For</span><span className="text-[13px] text-primary font-semibold">Women</span></div>
            <div className="flex justify-between"><span className="text-[13px]">Age Range</span><span className="text-[13px] text-primary font-semibold">18–30</span></div>
            <div className="flex justify-between"><span className="text-[13px]">Maximum Distance</span><span className="text-[13px] text-primary font-semibold">25 km</span></div>
            <div className="flex justify-between"><span className="text-[13px]">Global Mode</span><span className="text-[13px] font-semibold text-muted-foreground">Off</span></div>
          </div>
        </div>
        {/* Appearance */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <h3 className="text-[10px] font-bold text-muted-foreground px-4 pt-4 pb-2 uppercase tracking-wider">Appearance</h3>
          <button onClick={toggleDark} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 text-left">
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
            <span className="text-[13px] flex-1">{isDark ? "Light Mode" : "Dark Mode"}</span>
            <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${isDark ? "gradient-hot" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </button>
        </div>
        {/* Support */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <h3 className="text-[10px] font-bold text-muted-foreground px-4 pt-4 pb-2 uppercase tracking-wider">Help & Support</h3>
          {[{icon:HelpCircle,label:"Help Center",c:"text-primary"},{icon:Shield,label:"Safety Tips",c:"text-green-500"},{icon:Shield,label:"Community Guidelines",c:"text-primary"}].map(({icon:I,label,c}) => (
            <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 text-left"><I className={`w-4 h-4 ${c}`} /><span className="text-[13px] flex-1">{label}</span><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
          ))}
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 rounded-2xl h-12"><LogOut className="w-4 h-4" />Log Out</Button>
        <p className="text-center text-[10px] text-muted-foreground/40 pb-4">CampusConnect v2026.1 · Made with ❤️</p>
      </div>
    );
  }

  // ── Profile ──
  return (
    <div className="space-y-4 animate-fade-in max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Profile</h1>
        <button onClick={() => setTab("settings")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80"><Settings className="w-4 h-4" /></button>
      </div>

      {/* Photo carousel */}
      <div className="relative rounded-3xl overflow-hidden shadow-elevated h-[380px]">
        <img src={me.photos[pi] || me.avatar} alt="" className="w-full h-full object-cover" />
        {me.photos.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1">
            {me.photos.map((_, i) => <button key={i} onClick={() => setPi(i)} className={`h-[3px] rounded-full flex-1 transition-all ${i === pi ? "bg-white" : "bg-white/25"}`} />)}
          </div>
        )}
        <button className="absolute bottom-4 right-4 w-12 h-12 rounded-full gradient-hot flex items-center justify-center text-white shadow-glow hover:scale-105 transition-transform active:scale-95">
          <Camera className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-20">
          <div className="flex items-center gap-2">
            <h2 className="text-[26px] font-bold text-white">{me.name}<span className="text-white/60 font-normal ml-1">{me.age}</span></h2>
            {me.isVerified && <Verified className="w-5 h-5 text-[#00D4FF]" />}
          </div>
          <p className="text-white/50 text-sm flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" />{me.location}</p>
        </div>
      </div>

      {/* Badges */}
      {me.badges && me.badges.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {me.badges.map((b) => (
            <div key={b} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/8 text-primary text-xs font-semibold">
              {b === "Top Picks" ? "⭐" : b === "Photo Verified" ? "✓" : "❤️"} {b}
            </div>
          ))}
        </div>
      )}

      {/* Bio */}
      <div className="bg-card rounded-2xl p-4 shadow-card">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
        <p className="text-[14px] leading-relaxed">{me.bio}</p>
      </div>

      {/* Anthem */}
      {me.anthem && (
        <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0"><Music className="w-5 h-5 text-green-500" /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">My Anthem</p>
            <p className="text-sm font-semibold">{me.anthem}</p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Details</h3>
        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="w-3.5 h-3.5 text-primary" />{me.occupation}</div>
          <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5 text-primary" />{me.city}</div>
          {me.instagram && <div className="flex items-center gap-2 text-muted-foreground col-span-2"><Instagram className="w-3.5 h-3.5 text-pink-500" />{me.instagram}</div>}
        </div>
      </div>

      {/* Interests */}
      <div className="bg-card rounded-2xl p-4 shadow-card">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">Interests</h3>
        <div className="flex flex-wrap gap-1.5">
          {me.interests.map((i) => <Badge key={i} variant="secondary" className="text-xs rounded-full px-3 py-1.5">{i}</Badge>)}
        </div>
      </div>

      {/* Safety */}
      <div className="bg-card rounded-2xl p-4 shadow-card">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Safety</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          {["Photo Verified ✓","Profiles blurred until match","Block & Report in every chat","Automated scam detection active"].map((t) => (
            <p key={t} className="flex items-center gap-2"><span className="text-green-500">✓</span>{t}</p>
          ))}
        </div>
      </div>

      <Button className="w-full gradient-hot border-0 text-white rounded-2xl h-[52px] text-base font-semibold shadow-elevated hover:shadow-glow transition-all active:scale-[0.98]">
        <Edit className="w-4 h-4 mr-2" /> Edit Profile
      </Button>
    </div>
  );
};

export default Profile;
