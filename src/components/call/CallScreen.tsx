import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
} from "lucide-react";
import { useAgora } from "@/hooks/useAgora";
import { CallType } from "@/hooks/useCallSignaling";

interface CallScreenProps {
  channelName: string;
  callType: CallType;
  partnerName: string;
  partnerAvatar: string;
  onEndCall: () => void;
}

export function CallScreen({
  channelName,
  callType,
  partnerName,
  partnerAvatar,
  onEndCall,
}: CallScreenProps) {
  const {
    localVideoTrack,
    remoteUsers,
    isJoined,
    isMuted,
    isCameraOff,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleCamera,
  } = useAgora();

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasJoinedRef = useRef(false);

  // Join Agora channel on mount (once only)
  useEffect(() => {
    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;

    const init = async () => {
      try {
        console.log("[CallScreen] Joining Agora channel:", channelName);
        await joinChannel(channelName, callType === "video");
        console.log("[CallScreen] Successfully joined!");
      } catch (err: any) {
        console.error("[CallScreen] Failed to join channel:", err);
        setJoinError(err?.message || "Không thể kết nối cuộc gọi");
      }
    };
    init();

    return () => {
      console.log("[CallScreen] Cleaning up...");
      leaveChannel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // empty deps — join once on mount

  // Play local video
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  // Detect remote user and play their video
  useEffect(() => {
    if (remoteUsers.length > 0 && !isConnected) {
      console.log("[CallScreen] Remote user connected! Users:", remoteUsers.length);
      setIsConnected(true);
      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    // Play remote video
    const remoteUser = remoteUsers[0];
    if (remoteUser?.videoTrack && remoteVideoRef.current) {
      remoteUser.videoTrack.play(remoteVideoRef.current);
    }
  }, [remoteUsers, isConnected]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = async () => {
    await leaveChannel();
    if (timerRef.current) clearInterval(timerRef.current);
    onEndCall();
  };

  const isVideoCall = callType === "video";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gray-900 flex flex-col"
    >
      {/* Background */}
      {isVideoCall ? (
        <>
          {/* Remote video (full screen) */}
          <div
            ref={remoteVideoRef}
            className="absolute inset-0 bg-gray-800"
          >
            {!isConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/20"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                </div>
                <div className="text-center">
                  <h2 className="text-white text-xl font-bold">{partnerName}</h2>
                  <p className="text-white/60 text-sm mt-1 animate-pulse">
                    {joinError || "Đang kết nối..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local video (small pip) */}
          <div className="absolute top-16 right-4 w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-10 bg-gray-700">
            <div ref={localVideoRef} className="w-full h-full">
              {isCameraOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <VideoOff className="w-8 h-8 text-white/50" />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Audio call — show avatars */
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <img
              src={partnerAvatar}
              alt={partnerName}
              className="w-36 h-36 rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
            {isConnected ? (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
                <div
                  className="absolute inset-[-8px] rounded-full border-2 border-white/10 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold">{partnerName}</h2>
            <p className="text-white/60 text-sm mt-2">
              {isConnected
                ? formatDuration(callDuration)
                : joinError || "Đang kết nối..."}
            </p>
          </div>
        </div>
      )}

      {/* Top bar — call info */}
      <div className="relative z-20 flex items-center justify-center p-6">
        {isConnected && (
          <div className="bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white text-sm font-semibold">
              {formatDuration(callDuration)}
            </span>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="relative z-20 mt-auto pb-12 flex items-center justify-center gap-6">
        {/* Mute */}
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isMuted
              ? "bg-white text-gray-900"
              : "bg-white/20 text-white backdrop-blur-xl"
          }`}
        >
          {isMuted ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>

        {/* Camera toggle (video calls only) */}
        {isVideoCall && (
          <button
            onClick={toggleCamera}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isCameraOff
                ? "bg-white text-gray-900"
                : "bg-white/20 text-white backdrop-blur-xl"
            }`}
          >
            {isCameraOff ? (
              <VideoOff className="w-6 h-6" />
            ) : (
              <Video className="w-6 h-6" />
            )}
          </button>
        )}

        {/* End call */}
        <button
          onClick={handleEndCall}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all active:scale-90"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>
      </div>
    </motion.div>
  );
}
