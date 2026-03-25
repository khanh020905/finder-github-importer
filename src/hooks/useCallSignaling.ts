import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export type CallType = "audio" | "video";
export type CallStatus =
  | "idle"
  | "calling"
  | "ringing"
  | "connected"
  | "ended"
  | "rejected";

export interface CallInfo {
  channelName: string;
  callType: CallType;
  callerId: string;
  callerName: string;
  callerAvatar: string;
}

export function useCallSignaling(userId: string | undefined) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [incomingCall, setIncomingCall] = useState<CallInfo | null>(null);
  const [activeCall, setActiveCall] = useState<CallInfo | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Subscribe to call events for this user
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`calls:${userId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "call_invite" }, (payload) => {
        const data = payload.payload as CallInfo;
        // Only show incoming call if we're idle
        if (callStatus === "idle") {
          setIncomingCall(data);
          setCallStatus("ringing");
        }
      })
      .on("broadcast", { event: "call_accepted" }, (payload) => {
        const data = payload.payload as CallInfo;
        setActiveCall(data);
        setCallStatus("connected");
      })
      .on("broadcast", { event: "call_rejected" }, () => {
        setCallStatus("rejected");
        setTimeout(() => {
          setCallStatus("idle");
          setActiveCall(null);
        }, 2000);
      })
      .on("broadcast", { event: "call_ended" }, () => {
        setCallStatus("ended");
        setTimeout(() => {
          setCallStatus("idle");
          setActiveCall(null);
          setIncomingCall(null);
        }, 1000);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Generate a consistent channel name between two users
  const getChannelName = useCallback(
    (partnerId: string) => {
      if (!userId) return "";
      const sorted = [userId, partnerId].sort();
      return `call-${sorted[0].slice(0, 8)}-${sorted[1].slice(0, 8)}-${Date.now()}`;
    },
    [userId]
  );

  const sendCallInvite = useCallback(
    async (
      partnerId: string,
      callType: CallType,
      callerName: string,
      callerAvatar: string
    ) => {
      if (!userId) return null;

      const channelName = getChannelName(partnerId);
      const callInfo: CallInfo = {
        channelName,
        callType,
        callerId: userId,
        callerName,
        callerAvatar,
      };

      // Send to the partner's channel
      const partnerChannel = supabase.channel(`calls:${partnerId}`, {
        config: { broadcast: { self: false } },
      });

      await partnerChannel.subscribe();
      await partnerChannel.send({
        type: "broadcast",
        event: "call_invite",
        payload: callInfo,
      });

      // Clean up the temporary channel after sending
      setTimeout(() => supabase.removeChannel(partnerChannel), 1000);

      setActiveCall(callInfo);
      setCallStatus("calling");

      return callInfo;
    },
    [userId, getChannelName]
  );

  const sendCallAccepted = useCallback(async () => {
    if (!incomingCall) return;

    // Send acceptance to caller's channel
    const callerChannel = supabase.channel(`calls:${incomingCall.callerId}`, {
      config: { broadcast: { self: false } },
    });

    await callerChannel.subscribe();
    await callerChannel.send({
      type: "broadcast",
      event: "call_accepted",
      payload: incomingCall,
    });

    setTimeout(() => supabase.removeChannel(callerChannel), 1000);

    setActiveCall(incomingCall);
    setIncomingCall(null);
    setCallStatus("connected");

    return incomingCall;
  }, [incomingCall]);

  const sendCallRejected = useCallback(async () => {
    if (!incomingCall) return;

    const callerChannel = supabase.channel(`calls:${incomingCall.callerId}`, {
      config: { broadcast: { self: false } },
    });

    await callerChannel.subscribe();
    await callerChannel.send({
      type: "broadcast",
      event: "call_rejected",
      payload: {},
    });

    setTimeout(() => supabase.removeChannel(callerChannel), 1000);

    setIncomingCall(null);
    setCallStatus("idle");
  }, [incomingCall]);

  const sendCallEnded = useCallback(
    async (partnerId: string) => {
      const partnerChannel = supabase.channel(`calls:${partnerId}`, {
        config: { broadcast: { self: false } },
      });

      await partnerChannel.subscribe();
      await partnerChannel.send({
        type: "broadcast",
        event: "call_ended",
        payload: {},
      });

      setTimeout(() => supabase.removeChannel(partnerChannel), 1000);

      setCallStatus("idle");
      setActiveCall(null);
      setIncomingCall(null);
    },
    []
  );

  const resetCall = useCallback(() => {
    setCallStatus("idle");
    setActiveCall(null);
    setIncomingCall(null);
  }, []);

  return {
    callStatus,
    incomingCall,
    activeCall,
    sendCallInvite,
    sendCallAccepted,
    sendCallRejected,
    sendCallEnded,
    resetCall,
  };
}
