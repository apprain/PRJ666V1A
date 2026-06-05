"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/client-admin/login") {
      setReady(true);
      return;
    }

    const token = localStorage.getItem("client_admin_token");

    if (!token) {
      router.push("/client-admin/login");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}