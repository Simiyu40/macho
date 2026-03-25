"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SessionSyncer() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // router.refresh() triggers a re-fetch of all Server Components (Shell, Sidebar, etc.)
        // without a full page reload, maintaining performance.
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return null;
}
