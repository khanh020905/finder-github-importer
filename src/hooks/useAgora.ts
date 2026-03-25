import { useState, useRef, useCallback, useEffect } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

export interface AgoraState {
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  isJoined: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
}

export function useAgora() {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<ICameraVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log("[Agora] Cleaning up on unmount");
      localAudioRef.current?.close();
      localVideoRef.current?.close();
      clientRef.current?.leave().catch(() => {});
    };
  }, []);

  const joinChannel = useCallback(
    async (channelName: string, isVideo: boolean) => {
      if (!APP_ID) {
        console.error("[Agora] App ID not configured!");
        return;
      }

      console.log("[Agora] Creating client and joining channel:", channelName, "isVideo:", isVideo);

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Listen for remote users
      client.on("user-published", async (user, mediaType) => {
        console.log("[Agora] Remote user published:", user.uid, mediaType);
        await client.subscribe(user, mediaType);
        console.log("[Agora] Subscribed to remote user:", user.uid, mediaType);

        setRemoteUsers((prev) => {
          const exists = prev.find((u) => u.uid === user.uid);
          if (exists) return prev.map((u) => (u.uid === user.uid ? user : u));
          return [...prev, user];
        });

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        console.log("[Agora] Remote user unpublished:", user.uid, mediaType);
        if (mediaType === "audio") {
          user.audioTrack?.stop();
        }
        setRemoteUsers((prev) =>
          prev.map((u) => (u.uid === user.uid ? user : u))
        );
      });

      client.on("user-left", (user) => {
        console.log("[Agora] Remote user left:", user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      client.on("user-joined", (user) => {
        console.log("[Agora] Remote user joined:", user.uid);
      });

      client.on("connection-state-change", (curState, prevState) => {
        console.log("[Agora] Connection state:", prevState, "->", curState);
      });

      try {
        // Join channel (no token for testing mode)
        const uid = await client.join(APP_ID, channelName, null, null);
        console.log("[Agora] Joined channel successfully! UID:", uid);

        // Create local tracks
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localAudioRef.current = audioTrack;
        setLocalAudioTrack(audioTrack);
        console.log("[Agora] Created audio track");

        if (isVideo) {
          const videoTrack = await AgoraRTC.createCameraVideoTrack();
          localVideoRef.current = videoTrack;
          setLocalVideoTrack(videoTrack);
          console.log("[Agora] Created video track");
          await client.publish([audioTrack, videoTrack]);
        } else {
          await client.publish([audioTrack]);
        }

        console.log("[Agora] Published local tracks");
        setIsJoined(true);
      } catch (err) {
        console.error("[Agora] Failed to join or publish:", err);
        throw err;
      }
    },
    []
  );

  const leaveChannel = useCallback(async () => {
    console.log("[Agora] Leaving channel");
    localAudioRef.current?.close();
    localVideoRef.current?.close();
    localAudioRef.current = null;
    localVideoRef.current = null;
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);

    if (clientRef.current) {
      try {
        await clientRef.current.leave();
      } catch (e) {
        console.warn("[Agora] Leave error:", e);
      }
      clientRef.current = null;
    }

    setRemoteUsers([]);
    setIsJoined(false);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const toggleMute = useCallback(async () => {
    if (localAudioRef.current) {
      await localAudioRef.current.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleCamera = useCallback(async () => {
    if (localVideoRef.current) {
      await localVideoRef.current.setEnabled(isCameraOff);
      setIsCameraOff(!isCameraOff);
    }
  }, [isCameraOff]);

  return {
    localAudioTrack,
    localVideoTrack,
    remoteUsers,
    isJoined,
    isMuted,
    isCameraOff,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleCamera,
  };
}
