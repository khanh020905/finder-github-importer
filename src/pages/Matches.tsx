import { mockUsers, mockMatches } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const currentUser = mockUsers[0];

const Matches = () => {
  const matchedUsers = mockMatches
    .filter((m) => m.userId1 === currentUser.id || m.userId2 === currentUser.id)
    .map((m) => {
      const partnerId = m.userId1 === currentUser.id ? m.userId2 : m.userId1;
      return mockUsers.find((u) => u.id === partnerId)!;
    })
    .filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" /> Matches
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {matchedUsers.length} người đã match với bạn
        </p>
      </div>

      {matchedUsers.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">Chưa có match nào</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Hãy vuốt phải để thích ai đó. Khi cả hai cùng thích nhau, bạn sẽ match!
          </p>
          <Link to="/">
            <Button className="gradient-primary border-0 text-primary-foreground mt-2">
              Bắt đầu vuốt
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {matchedUsers.map((user) => {
            const commonInterests = user.interests.filter((i) =>
              currentUser.interests.includes(i)
            );
            return (
              <div
                key={user.id}
                className="bg-card rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{user.name}, {user.age}</h3>
                    <p className="text-xs text-muted-foreground">{user.major}</p>
                    {commonInterests.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-primary font-medium">
                          {commonInterests.length} sở thích chung
                        </span>
                      </div>
                    )}
                  </div>
                  <Link to="/messages">
                    <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                      <MessageCircle className="w-4 h-4 mr-1" /> Chat
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;
