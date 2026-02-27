import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send,
  ArrowLeft,
  Smile,
  Verified,
  Check,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  Heart,
} from "lucide-react";
import { useAuth, Profile } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Match {
  id: string;
  user1: string;
  user2: string;
  created_at: string;
}

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  type: string;
  seen: boolean;
  created_at: string;
}

interface ConversationPartner {
  matchId: string;
  user: Profile;
  lastMessage?: Message;
  unreadCount?: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [activeMatch, setActiveMatch] = useState<string | null>(null);
  const [activePartner, setActivePartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch conversations (matches with profiles)
  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      setLoading(true);
      const { data: matches } = await supabase
        .from("matches")
        .select("*")
        .or(`user1.eq.${user.id},user2.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!matches || matches.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const otherIds = matches.map((m) =>
        m.user1 === user.id ? m.user2 : m.user1,
      );
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", otherIds);
      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

      // Get last message for each match
      const convos: ConversationPartner[] = [];
      for (const m of matches) {
        const otherId = m.user1 === user.id ? m.user2 : m.user1;
        const profile = profileMap.get(otherId);
        if (!profile) continue;

        const { data: lastMsgs } = await supabase
          .from("messages")
          .select("*")
          .eq("match_id", m.id)
          .order("created_at", { ascending: false })
          .limit(1);

        convos.push({
          matchId: m.id,
          user: profile,
          lastMessage: lastMsgs?.[0] || undefined,
        });
      }

      setConversations(convos);
      setLoading(false);
    };
    fetchConversations();
  }, [user]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeMatch) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", activeMatch)
        .order("created_at", { ascending: true });
      setMessages(data || []);

      // Mark as seen
      if (data && data.length > 0) {
        await supabase
          .from("messages")
          .update({ seen: true })
          .eq("match_id", activeMatch)
          .neq("sender_id", user?.id);
      }
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`messages:${activeMatch}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${activeMatch}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          if (newMessage.sender_id !== user?.id) {
            supabase
              .from("messages")
              .update({ seen: true })
              .eq("id", newMessage.id);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeMatch, user?.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeMatch || !user) return;
    const content = newMsg.trim();
    setNewMsg("");

    const { error } = await supabase.from("messages").insert({
      match_id: activeMatch,
      sender_id: user.id,
      content,
      type: "text",
    });

    if (error) {
      console.error("Send error:", error);
    }
  };

  const fmtTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Hôm nay";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
    return d.toLocaleDateString("vi-VN");
  };

  // Chat view
  if (activeMatch && activePartner) {
    const partnerAvatar =
      activePartner.avatar_url ||
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${activePartner.id}&backgroundColor=ffd5dc`;

    return (
      <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in bg-background">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/10 bg-card/50 backdrop-blur-xl sticky top-0 z-20">
          <button
            onClick={() => {
              setActiveMatch(null);
              setActivePartner(null);
            }}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-border/10">
              <img
                src={partnerAvatar}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            {activePartner.is_online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-sm tracking-tight truncate">
                {activePartner.name}
              </h3>
              {activePartner.is_verified && (
                <Verified className="w-3.5 h-3.5 text-superblue-500 fill-white" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {activePartner.is_online ? "Đang hoạt động" : "Ngoại tuyến"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4 max-w-[280px] mx-auto animate-fade-in">
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-12 h-12 text-primary/20" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bạn đã match với{" "}
                <span className="font-bold text-foreground">
                  {activePartner.name}
                </span>
                ! 🎉 Gửi tin nhắn đầu tiên để bắt đầu trò chuyện.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === user?.id;
              const isLast = i === messages.length - 1;
              const showDate =
                i === 0 ||
                fmtDate(msg.created_at) !== fmtDate(messages[i - 1].created_at);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={msg.id}
                  className="group"
                >
                  {showDate && (
                    <div className="flex items-center justify-center my-6">
                      <span className="text-[10px] text-muted-foreground bg-muted/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        {fmtDate(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                  >
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0 mb-1">
                        <img
                          src={partnerAvatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`relative max-w-[75%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                        isMe
                          ? "gradient-hot text-white rounded-br-md"
                          : "bg-muted/50 backdrop-blur-sm rounded-bl-md border border-border/5"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div
                        className={`flex items-center gap-1.5 mt-1.5 select-none ${isMe ? "justify-end" : ""}`}
                      >
                        <span
                          className={`text-[9px] font-medium tracking-tighter ${isMe ? "text-white/70" : "text-muted-foreground/70"}`}
                        >
                          {fmtTime(msg.created_at)}
                        </span>
                        {isMe &&
                          (msg.seen ? (
                            <CheckCheck className="w-3 h-3 text-white/50" />
                          ) : (
                            <Check className="w-3 h-3 text-white/30" />
                          ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Input area */}
        <div className="p-4 bg-card/30 backdrop-blur-2xl border-t border-border/10">
          <div className="flex items-end gap-2">
            <button className="w-11 h-11 rounded-2xl hover:bg-muted flex items-center justify-center text-muted-foreground transition-all active:scale-95 shrink-0">
              <Smile className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Aa..."
                rows={1}
                className="w-full max-h-32 min-h-[44px] rounded-2xl bg-muted/40 border-0 focus:ring-2 focus:ring-primary/20 py-3 px-4 text-sm resize-none scrollbar-none transition-all"
                style={{ height: "auto" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMsg.trim()}
              className="w-11 h-11 rounded-2xl gradient-hot flex items-center justify-center text-white shadow-romantic hover:scale-105 transition-all active:scale-90 disabled:opacity-40 disabled:scale-100 shrink-0"
            >
              <Send className="w-5 h-5 rotate-45 -translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversation list view
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl font-black italic font-serif-display text-gradient-flame">
          Tin nhắn
        </h1>
        <div className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="relative group">
        <Input
          placeholder="Tìm kiếm cuộc trò chuyện..."
          className="rounded-full h-12 bg-muted/30 border-0 px-6 focus:ring-2 focus:ring-primary/10 transition-all pl-12"
        />
        <svg
          className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 items-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 space-y-6 animate-fade-in">
          <div className="w-32 h-32 rounded-[3.5rem] bg-gradient-to-br from-primary/5 to-muted/10 flex items-center justify-center mx-auto shadow-inner relative">
            <Send className="w-12 h-12 text-primary/20 rotate-12" />
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center rotate-[-12deg]">
              <Smile className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-xl italic font-serif-display">
              No heartbeats yet...
            </h3>
            <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
              Match với ai đó trên{" "}
              <span className="text-primary font-bold">Swipe</span> để bắt đầu
              những cuộc trò chuyện thú vị!
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/swipe")}
            className="rounded-full px-8 py-6 h-auto font-bold gradient-hot text-white border-0 shadow-glow transition-all active:scale-95"
          >
            Bắt đầu khám phá
          </Button>
        </div>
      ) : (
        <div className="space-y-1 divide-y divide-border/5">
          {conversations.map((convo) => {
            const avatarUrl =
              convo.user.avatar_url ||
              `https://api.dicebear.com/7.x/lorelei/svg?seed=${convo.user.id}&backgroundColor=ffd5dc`;
            const hasUnread =
              convo.lastMessage &&
              !convo.lastMessage.seen &&
              convo.lastMessage.sender_id !== user?.id;

            return (
              <motion.button
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "var(--muted-foreground-10)",
                }}
                whileTap={{ scale: 0.99 }}
                key={convo.matchId}
                onClick={() => {
                  setActiveMatch(convo.matchId);
                  setActivePartner(convo.user);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left ${hasUnread ? "bg-primary/[0.03]" : ""}`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-16 h-16 rounded-[1.75rem] overflow-hidden shadow-card border-2 ${hasUnread ? "border-primary" : "border-transparent"}`}
                  >
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {convo.user.is_online ? (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                  ) : (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-muted-foreground/30 border-2 border-background shadow-sm" />
                  )}
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className={`font-bold text-base tracking-tight truncate ${hasUnread ? "text-foreground" : "text-foreground/90"}`}
                      >
                        {convo.user.name}
                      </h3>
                      {convo.user.is_verified && (
                        <Verified className="w-3.5 h-3.5 text-superblue-500 fill-white" />
                      )}
                    </div>
                    {convo.lastMessage && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${hasUnread ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {fmtTime(convo.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm truncate leading-tight ${hasUnread ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                    >
                      {convo.lastMessage
                        ? (convo.lastMessage.sender_id === user?.id
                            ? "Bạn: "
                            : "") + convo.lastMessage.content
                        : "Match mới! Hãy gửi lời chào 👋"}
                    </p>
                    {hasUnread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow flex-shrink-0" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
