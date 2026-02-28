import { useState } from "react";
import { mockUsers } from "@/lib/mock-data";
import { UserCard } from "@/components/finder/UserCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const allInterests = Array.from(new Set(mockUsers.flatMap((u) => u.interests)));
const allMajors = Array.from(new Set(mockUsers.map((u) => u.occupation)));
const currentUser = mockUsers[0];

const FindFriends = () => {
  const [search, setSearch] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedMajor, setSelectedMajor] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const filtered = mockUsers
    .filter((u) => u.id !== currentUser.id)
    .filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedMajor && u.occupation !== selectedMajor) return false;
      if (selectedInterests.length > 0 && !selectedInterests.some((i) => u.interests.includes(i)))
        return false;
      return true;
    })
    .map((u) => ({
      ...u,
      commonTags: u.interests.filter((i) => currentUser.interests.includes(i)).length,
    }))
    .sort((a, b) => b.commonTags - a.commonTags);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Tìm bạn bè</h1>
        <p className="text-muted-foreground text-sm">Kết nối với sinh viên cùng sở thích</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Major filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedMajor === "" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedMajor("")}
        >
          Tất cả ngành
        </Badge>
        {allMajors.map((major) => (
          <Badge
            key={major}
            variant={selectedMajor === major ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedMajor(selectedMajor === major ? "" : major)}
          >
            {major}
          </Badge>
        ))}
      </div>

      {/* Interest filter */}
      <div>
        <p className="text-sm font-medium mb-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Sở thích
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allInterests.map((interest) => (
            <Badge
              key={interest}
              variant={selectedInterests.includes(interest) ? "default" : "secondary"}
              className="cursor-pointer text-xs"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((user) => (
          <UserCard key={user.id} user={user} commonTags={user.commonTags} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Không tìm thấy kết quả phù hợp</p>
      )}
    </div>
  );
};

export default FindFriends;
