import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"logo" | "tagline" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 700);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(() => navigate("/login"), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gradient-flame overflow-hidden">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full border border-white/10 animate-ring-expand" />
        <div className="absolute w-40 h-40 rounded-full border border-white/10 animate-ring-expand" style={{ animationDelay: "0.5s" }} />
        <div className="absolute w-40 h-40 rounded-full border border-white/10 animate-ring-expand" style={{ animationDelay: "1s" }} />
      </div>

      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/8"
          style={{
            width: `${40 + i * 30}px`,
            height: `${40 + i * 30}px`,
            left: `${15 + i * 16}%`,
            top: `${25 + (i % 3) * 22}%`,
            animation: `float ${3 + i * 0.6}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Logo */}
      <div className={`relative z-10 transition-all duration-600 ${phase === "exit" ? "scale-[2] opacity-0" : "scale-100 opacity-100"}`}>
        <div className={`w-28 h-28 rounded-[2rem] bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl ${phase === "logo" ? "animate-bounce-in" : ""}`}>
          <Flame className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
        </div>
      </div>

      {/* Brand text */}
      <div className={`relative z-10 mt-8 text-center transition-all duration-500 ${
        phase === "exit" ? "translate-y-6 opacity-0" : phase === "tagline" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}>
        <h1 className="text-5xl font-black text-white tracking-tight font-display" style={{ letterSpacing: "-0.02em" }}>
          tinder
        </h1>
        <p className="text-white/70 text-sm mt-2 font-medium tracking-wide uppercase" style={{ letterSpacing: "0.2em" }}>
          Recharged 2026
        </p>
      </div>

      {/* Tagline */}
      <div className={`relative z-10 mt-4 transition-all duration-500 delay-200 ${
        phase === "tagline" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <p className="text-white/50 text-xs font-medium">Swipe. Match. Date.</p>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full bg-white/50 rounded-full animate-shimmer" style={{ width: "60%", backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)" }} />
      </div>
    </div>
  );
};

export default Splash;
