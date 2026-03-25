import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, X } from "lucide-react";
import { CallInfo } from "@/hooks/useCallSignaling";

interface IncomingCallOverlayProps {
  callInfo: CallInfo;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallOverlay({
  callInfo,
  onAccept,
  onReject,
}: IncomingCallOverlayProps) {
  const isVideo = callInfo.callType === "video";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed inset-0 z-[99] flex items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        {/* Call card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 bg-gray-900/90 backdrop-blur-2xl rounded-[2.5rem] p-8 w-[320px] flex flex-col items-center gap-6 border border-white/10 shadow-2xl"
        >
          {/* Pulsing rings behind avatar */}
          <div className="relative">
            <div className="absolute inset-[-16px] rounded-full border-2 border-green-500/20 animate-ping" />
            <div
              className="absolute inset-[-32px] rounded-full border border-green-500/10 animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute inset-[-48px] rounded-full border border-green-500/5 animate-ping"
              style={{ animationDelay: "1s" }}
            />

            <img
              src={callInfo.callerAvatar}
              alt={callInfo.callerName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl relative z-10"
            />

            {/* Call type badge */}
            <div className="absolute -bottom-1 -right-1 z-20 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              {isVideo ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <Phone className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-center space-y-1">
            <h2 className="text-white text-xl font-bold">
              {callInfo.callerName}
            </h2>
            <p className="text-white/50 text-sm">
              {isVideo ? "Cuộc gọi video đến" : "Cuộc gọi thoại đến"}
            </p>
          </div>

          {/* Ringing animation */}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-8 mt-2">
            {/* Reject */}
            <button
              onClick={onReject}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all active:scale-90 group-hover:scale-105">
                <X className="w-7 h-7 text-white" />
              </div>
              <span className="text-white/60 text-xs font-medium">
                Từ chối
              </span>
            </button>

            {/* Accept */}
            <button
              onClick={onAccept}
              className="flex flex-col items-center gap-2 group"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all active:scale-90 group-hover:scale-105"
              >
                <Phone className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-white/60 text-xs font-medium">
                Chấp nhận
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
