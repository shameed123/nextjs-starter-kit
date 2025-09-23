"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

interface SessionData {
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    image?: string;
  };
  session?: {
    id: string;
    token: string;
    expiresAt: Date;
  };
}

export function useSession() {
  const [data, setData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await authClient.getSession();
        setData(session.data as SessionData);
      } catch (error) {
        console.error("Failed to get session:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  return {
    data,
    isLoading,
  };
}