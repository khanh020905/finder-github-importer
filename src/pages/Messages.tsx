import { mockUsers, mockMessages, type Message } from "@/lib/mock-data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft } from "lucide-react";

const currentUser = mockUsers[0];
const chatPartners = mockUsers.filter((u) => u.id !== currentUser.id).slice(0, 4);

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const userMessages = selectedUser
    ? messages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.receiverId === selectedUser.id) ||
          (m.senderId === selectedUser.id && m.receiverId === currentUser.id)
      )
    : [];

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return;
    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  if (selectedUser) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
        {/* Chat header */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {selectedUser.name[0]}
          </div>
          <div>
            <p className="font-semibold text-sm">{selectedUser.name}</p>
            <p className="text-xs text-muted-foreground">{selectedUser.major}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {userMessages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              Bắt đầu cuộc trò chuyện! 💬
            </p>
          )}
          {userMessages.map((msg) => {
            const isMine = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-3 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhắn tin..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="gradient-primary border-0 text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Tin nhắn</h1>
      <div className="space-y-2">
        {chatPartners.map((user) => {
          const lastMsg = messages
            .filter(
              (m) =>
                (m.senderId === currentUser.id && m.receiverId === user.id) ||
                (m.senderId === user.id && m.receiverId === currentUser.id)
            )
            .at(-1);
          return (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow text-left"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {lastMsg?.content || "Bắt đầu trò chuyện..."}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
