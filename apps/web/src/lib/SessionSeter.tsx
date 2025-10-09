"use client";

import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import { Session } from "next-auth";
import { useEffect } from "react";

interface SessionSetterProps {
  session: Session | null;
}
export default function SessionSetter({ session }: SessionSetterProps) {
  const { setSession } = useUserSessionStore();

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  return null;
}
