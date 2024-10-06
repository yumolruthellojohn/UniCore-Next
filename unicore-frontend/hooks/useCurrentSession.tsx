import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

// This hook doesn't rely on the session provider
export const useCurrentSession = () => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("loading");
  const pathName = usePathname();

  const retrieveSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      if (sessionData) {
        setCurrentSession(sessionData);
        setCurrentStatus("authenticated");
        return;
      }

      setCurrentStatus("unauthenticated");
    } catch (error) {
      setCurrentStatus("unauthenticated");
      setCurrentSession(null);
    }
  }, []);

  useEffect(() => {
    if (!currentSession) {
      retrieveSession();
    }

    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, currentSession, pathName]);

  return { currentSession, currentStatus };
};