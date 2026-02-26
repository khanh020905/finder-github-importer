import { mockUsers, mockMessages, mockIceBreakers, mockDateIdeas, type Message } from "@/lib/mock-data";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, ImagePlus, Smile, MoreVertical, Flag, Ban, Lightbulb, Verified, Check, CheckCheck, Mic, MapPin, Star, Coffee, X } from "lucide-react";

const me = mockUsers[0];
const partners = mockUsers.filter((u) => u.id !== me.id).slice(0, 4);

const Messages = () => {
  const [sel, setSel] = useState<typeof mockUsers[0] | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [msgs, setMsgs] = useState<Message[]>(mockMessages);
  const [typing, setTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showIce, setShowIce] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const chat = sel ? msgs.filter((m) => (m.senderId===me.id && m.receiverId===sel.id) || (m.senderId===sel.id && m.receiverId===me.id) || m.type==="system") : [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat.length]);
  useEffect(() => {
    if (sel) { const t1 = setTimeout(() => setTyping(true), 3000); const t2 = setTimeout(() => setTyping(false), 5000); return () => { clearTimeout(t1); clearTimeout(t2); }; }
  }, [sel]);

  const send = (c?: string) => {
    const t = c || newMsg.trim();
    if (!t || !sel) return;
    setMsgs((p) => [...p, { id: Date.now().toString(), senderId: me.id, receiverId: sel.id, content: t, timestamp: new Date().toISOString(), type: "text", seen: false }]);
    setNewMsg("");
    setShowIce(false);
    setShowDates(false);
  };

  const fmtTime = (ts: string) => new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  // ── Chat View ──
  if (sel) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b relative">
          <button onClick={() => { setSel(null); setShowMenu(false); setShowDates(false); setShowIce(false); }} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-card"><img src={sel.avatar} alt="" className="w-full h-full object-cover bg-primary/5" /></div>
            {sel.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-card" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm flex items-center gap-1">{sel.name} {sel.isVerified && <Verified className="w-3.5 h-3.5 text-[#00D4FF]" />}</p>
            <p className="text-xs text-muted-foreground">{sel.isOnline ? <span className="text-green-500">Active now</span> : sel.lastActive}</p>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted"><MoreVertical className="w-5 h-5" /></button>
          {showMenu && (
            <div className="absolute right-0 top-14 w-52 bg-card rounded-2xl shadow-elevated border z-50 p-1.5 animate-scale-in">
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-muted text-left"><MapPin className="w-4 h-4 text-[#667eea]" />Xem vị trí trên Map</button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-muted text-left text-amber-600"><Flag className="w-4 h-4" />Báo cáo (Report)</button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-destructive/10 text-left text-destructive"><Ban className="w-4 h-4" />Chặn (Block)</button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1.5 px-0.5" onClick={() => setShowMenu(false)}>
          {chat.map((m, i) => {
            if (m.type === "system") return <p key={m.id} className="text-center text-xs text-muted-foreground bg-muted/40 w-fit mx-auto px-3 py-1 rounded-full my-2">{m.content}</p>;
            const mine = m.senderId === me.id;
            const showAv = !mine && (i === 0 || chat[i-1]?.senderId !== m.senderId);
            return (
              <div key={m.id} className={`flex gap-2 ${mine ? "justify-end" : "justify-start"} animate-slide-up`} style={{ animationDelay: `${i*0.015}s` }}>
                {!mine && showAv ? <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-auto"><img src={sel.avatar} alt="" className="w-full h-full object-cover bg-primary/5" /></div> : !mine ? <div className="w-7 shrink-0" /> : null}
                <div className="max-w-[75%] group">
                  <div className={`px-4 py-2.5 text-[14px] leading-relaxed ${mine ? "gradient-hot text-white rounded-[20px] rounded-br-md shadow-card" : "bg-muted rounded-[20px] rounded-bl-md"}`}>{m.content}</div>
                  <div className={`flex items-center gap-1 mt-0.5 ${mine ? "justify-end" : ""}`}>
                    <span className="text-[10px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">{fmtTime(m.timestamp)}</span>
                    {mine && <span className="text-primary/40">{m.seen ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0"><img src={sel.avatar} alt="" className="w-full h-full object-cover bg-primary/5" /></div>
              <div className="bg-muted rounded-[20px] rounded-bl-md px-4 py-3"><div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{animationDelay:"0ms"}} /><div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{animationDelay:"150ms"}} /><div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{animationDelay:"300ms"}} /></div></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Date Ideas panel */}
        {showDates && (
          <div className="border-t border-border/40 bg-muted/20 p-3 animate-slide-up max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5 text-primary" /> Gợi ý Date hôm nay</p>
              <button onClick={() => setShowDates(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {mockDateIdeas.slice(0, 4).map((d) => (
                <button key={d.id} onClick={() => send(`Ê, mình đi ${d.name} không? ${d.emoji} (${d.address})`)} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all text-left">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"><img src={d.image} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{d.emoji} {d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.address}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-amber-500 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-500" />{d.rating}</span>
                      <span className="text-[10px] text-muted-foreground">{d.distance}km</span>
                      <span className="text-[10px] text-muted-foreground">{"$".repeat(d.priceLevel)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ice breakers */}
        {showIce && (
          <div className="border-t border-border/40 bg-primary/3 p-3 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-primary" /> Ice-breakers</p>
              <button onClick={() => setShowIce(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1.5">
              {mockIceBreakers.slice(0, 4).map((ib) => (
                <button key={ib.id} onClick={() => send(ib.question)} className="w-full text-left text-sm px-3 py-2.5 rounded-xl bg-card hover:bg-primary/5 transition-colors">{ib.emoji} {ib.question}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2 pt-3 border-t">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted shrink-0"><ImagePlus className="w-5 h-5" /></button>
          <button onClick={() => { setShowDates(!showDates); setShowIce(false); }} className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${showDates ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}><MapPin className="w-5 h-5" /></button>
          <button onClick={() => { setShowIce(!showIce); setShowDates(false); }} className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${showIce ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}><Lightbulb className="w-5 h-5" /></button>
          <div className="flex-1 relative">
            <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key==="Enter" && send()} className="h-11 rounded-2xl bg-muted/40 border-0 pr-10 focus:ring-2 focus:ring-primary/15" />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"><Smile className="w-5 h-5" /></button>
          </div>
          {newMsg.trim() ? (
            <Button onClick={() => send()} size="icon" className="w-11 h-11 rounded-xl gradient-hot border-0 text-white shadow-card active:scale-90"><Send className="w-4 h-4" /></Button>
          ) : (
            <button className="w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted"><Mic className="w-5 h-5" /></button>
          )}
        </div>
      </div>
    );
  }

  // ── Chat List ──
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Messages</h1>
      <div className="space-y-2">
        {partners.map((u, i) => {
          const last = msgs.filter((m) => (m.senderId===me.id && m.receiverId===u.id) || (m.senderId===u.id && m.receiverId===me.id)).at(-1);
          const unread = msgs.filter((m) => m.senderId===u.id && m.receiverId===me.id && !m.seen).length;
          return (
            <button key={u.id} onClick={() => { setSel(u); setShowMenu(false); setShowIce(false); setShowDates(false); }} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all text-left animate-slide-up" style={{ animationDelay: `${i*0.04}s` }}>
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-card"><img src={u.avatar} alt="" className="w-full h-full object-cover bg-primary/5" /></div>
                {u.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between"><p className="font-semibold text-sm flex items-center gap-1">{u.name} {u.isVerified && <Verified className="w-3.5 h-3.5 text-[#00D4FF]" />}</p><span className="text-[10px] text-muted-foreground">{last ? fmtTime(last.timestamp) : ""}</span></div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{last?.content || "Gửi tin nhắn đầu tiên..."}</p>
                  {unread > 0 && <div className="w-5 h-5 rounded-full gradient-hot flex items-center justify-center shrink-0 ml-2"><span className="text-[10px] text-white font-bold">{unread}</span></div>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
