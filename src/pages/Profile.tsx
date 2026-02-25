import { mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, BookOpen, Heart } from "lucide-react";

const currentUser = mockUsers[0];

const Profile = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      {/* Avatar & name */}
      <div className="text-center">
        <div className="w-24 h-24 rounded-full gradient-primary mx-auto flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
          {currentUser.name[0]}
        </div>
        <h1 className="text-2xl font-bold">{currentUser.name}</h1>
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
          <BookOpen className="w-3.5 h-3.5" /> {currentUser.major} · Năm 1
        </p>
      </div>

      {/* Bio */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-semibold mb-2">Giới thiệu</h3>
        <p className="text-sm text-muted-foreground">{currentUser.bio}</p>
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

      <Button className="w-full gradient-primary border-0 text-primary-foreground">
        <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa hồ sơ
      </Button>
    </div>
  );
};

export default Profile;
