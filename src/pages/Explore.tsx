import { useState } from "react";
import { mockUsers, mockDateIdeas, interestTags } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, MapPin, Sparkles, Star, Heart, Verified, Navigation, Map, X, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const me = mockUsers[0];
const others = mockUsers.filter((u) => u.id !== me.id);

const Explore = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 30]);
  const [distance, setDistance] = useState(25);
  const [genderF, setGenderF] = useState<"male"|"female"|"all">("all");
  const [query, setQuery] = useState("");

  const filtered = others.filter((u) => {
    if (genderF !== "all" && u.gender !== genderF) return false;
    if (u.age < ageRange[0] || u.age > ageRange[1]) return false;
    if (u.distance > distance) return false;
    if (query && !u.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Explore</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowMap(!showMap)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${showMap ? "gradient-map text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            <Map className="w-4 h-4" />
          </button>
          <button onClick={() => setShowFilter(!showFilter)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${showFilter ? "gradient-hot text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name..." className="w-full h-12 rounded-2xl bg-muted/40 border-0 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/15 focus:outline-none" />
      </div>

      {/* Map View */}
      {showMap && (
        <div className="rounded-2xl overflow-hidden shadow-elevated animate-slide-up relative h-[300px] bg-muted">
          {/* Simulated map */}
          <div className="absolute inset-0 gradient-map opacity-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Center pin (you) */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full gradient-hot flex items-center justify-center shadow-glow border-[3px] border-white">
                  <Navigation className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-[10px] font-bold mt-1 bg-primary text-white px-2 py-0.5 rounded-full">You</span>
                <div className="absolute w-20 h-20 rounded-full border-2 border-primary/20 animate-map-pulse -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Other users on map */}
              {others.slice(0, 5).map((u, i) => {
                const positions = [
                  { top: "-90px", left: "60px" },
                  { top: "-40px", left: "-100px" },
                  { top: "50px", left: "80px" },
                  { top: "80px", left: "-60px" },
                  { top: "-60px", left: "120px" },
                ];
                return (
                  <div key={u.id} className="absolute z-10 animate-bounce-in group cursor-pointer" style={{ ...positions[i], animationDelay: `${i*0.1}s` }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-elevated group-hover:scale-110 transition-transform">
                      <img src={u.avatar} alt="" className="w-full h-full object-cover bg-primary/5" />
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card shadow-card rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-semibold">{u.name.split(" ").pop()}, {u.age} · {u.distance}km</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map controls */}
          <button className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-card shadow-elevated rounded-xl px-3 py-2 text-xs font-semibold hover:shadow-glow transition-all">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Open Google Maps
          </button>
          <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm shadow-card rounded-xl px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Passport Mode</p>
            <p className="text-sm font-semibold">TP. Hồ Chí Minh</p>
          </div>
        </div>
      )}

      {/* Filter */}
      {showFilter && (
        <div className="bg-card rounded-2xl p-4 shadow-elevated space-y-5 animate-slide-up">
          <div className="flex items-center justify-between"><h3 className="font-bold text-sm">Filters</h3><button onClick={() => { setAgeRange([18,30]); setDistance(25); setGenderF("all"); }} className="text-xs text-primary hover:underline font-medium">Reset</button></div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</p>
            <div className="flex gap-2">
              {([["all","All"],["male","Men"],["female","Women"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setGenderF(v)} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${genderF===v ? "gradient-hot text-white shadow-card" : "bg-muted/40 text-muted-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Age Range</p><span className="text-xs font-bold text-primary">{ageRange[0]}–{ageRange[1]}</span></div>
            <div className="flex gap-3">
              <input type="range" min={18} max={50} value={ageRange[0]} onChange={(e) => setAgeRange([Math.min(+e.target.value, ageRange[1]), ageRange[1]])} className="flex-1 accent-primary" />
              <input type="range" min={18} max={50} value={ageRange[1]} onChange={(e) => setAgeRange([ageRange[0], Math.max(+e.target.value, ageRange[0])])} className="flex-1 accent-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Distance</p><span className="text-xs font-bold text-primary">{distance} km</span></div>
            <input type="range" min={1} max={100} value={distance} onChange={(e) => setDistance(+e.target.value)} className="w-full accent-primary" style={{ background: `linear-gradient(to right, #FF4458 ${distance}%, hsl(var(--muted)) ${distance}%)` }} />
          </div>
          <Button onClick={() => setShowFilter(false)} className="w-full gradient-hot border-0 text-white rounded-xl h-11 shadow-card">Apply ({filtered.length} results)</Button>
        </div>
      )}

      {/* Date Spots section */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-accent" /> Date Spots Near You
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {mockDateIdeas.slice(0, 4).map((d) => (
            <div key={d.id} className="shrink-0 w-44 bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all group cursor-pointer">
              <div className="h-24 overflow-hidden"><img src={d.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
              <div className="p-2.5">
                <p className="text-xs font-semibold truncate">{d.emoji} {d.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-amber-500 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-500" />{d.rating}</span>
                  <span className="text-[10px] text-muted-foreground">{d.distance}km</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> {query ? `Results (${filtered.length})` : "Top Picks"}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map((u, i) => {
            const cc = u.interests.filter((x) => me.interests.includes(x)).length;
            return (
              <Link key={u.id} to="/" className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all animate-slide-up" style={{ animationDelay: `${i*0.04}s` }}>
                <div className="h-52 relative overflow-hidden">
                  <img src={u.photos[0] || u.avatar} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  {u.isVerified && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"><Verified className="w-3 h-3 text-[#00D4FF]" /></div>}
                  {u.isOnline && <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-white text-[9px] font-medium">Online</span></div>}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10">
                    <p className="text-white text-sm font-bold">{u.name.split(" ").slice(-2).join(" ")}, {u.age}</p>
                    <p className="text-white/50 text-[10px]">{u.distance}km · {u.location}</p>
                  </div>
                </div>
                {cc > 0 && <div className="px-2.5 py-1.5 flex items-center gap-1"><Star className="w-3 h-3 text-primary" /><span className="text-[10px] text-primary font-semibold">{cc} common</span></div>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Explore;
