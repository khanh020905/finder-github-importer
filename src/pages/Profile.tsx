import { mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  MapPin,
  GraduationCap,
  Heart,
  Briefcase,
  User,
  Ruler,
  Shield,
} from "lucide-react";

const currentUser = mockUsers[0];

const genderLabels: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  all: "Tất cả",
};

const Profile = () => {
  return (
    <div className="space-y-4 animate-fade-in max-w-lg mx-auto">
      {/* Avatar & name */}
      <div className="text-center">
        <div className="w-28 h-28 rounded-full gradient-warm mx-auto flex items-center justify-center text-primary-foreground text-4xl font-bold mb-4 shadow-elevated">
          {currentUser.name[0]}
        </div>
        <h1 className="text-2xl font-bold">
          {currentUser.name}, {currentUser.age}
        </h1>
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5" /> {currentUser.location}
        </p>
      </div>

      {/* Bio */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-semibold mb-2">Giới thiệu</h3>
        <p className="text-sm text-muted-foreground">{currentUser.bio}</p>
      </div>

      {/* Details */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-3">
        <h3 className="text-sm font-semibold">Thông tin cá nhân</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Giới tính: {genderLabels[currentUser.gender]}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-3.5 h-3.5 text-primary" />
            <span>Tìm: {genderLabels[currentUser.genderPreference]}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span>{currentUser.major}</span>
          </div>
          {currentUser.occupation && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span>{currentUser.occupation}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="w-3.5 h-3.5 text-primary" />
            <span>Khoảng cách: 15km</span>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-primary" /> Sở thích
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {currentUser.interests.map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Safety */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-secondary" /> Bảo mật
        </h3>
        <p className="text-xs text-muted-foreground">
          Thông tin cá nhân chỉ hiển thị khi cả hai đã match. Sở thích chung được hiển thị để giúp kết nối tốt hơn.
        </p>
      </div>

      <Button className="w-full gradient-primary border-0 text-primary-foreground">
        <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa hồ sơ
      </Button>
    </div>
  );
};

export default Profile;
