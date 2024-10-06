"use client";

import { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    const [session, setSession] = useState<Session | null>(null);

    const fetchSession = useCallback(async () => {
    const session = await getSession();
        setSession(session);
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}