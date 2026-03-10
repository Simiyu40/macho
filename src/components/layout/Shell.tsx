import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import styles from "./Shell.module.css";
import { createClient } from "@/utils/supabase/server";

interface ShellProps {
  children: React.ReactNode;
}

export default async function Shell({ children }: ShellProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.appWrapper}>
      <Navbar user={user} />
      <Sidebar user={user} />
      <main className={styles.mainContent}>
        {children}
      </main>
      <BottomNav user={user} />
    </div>
  );
}
