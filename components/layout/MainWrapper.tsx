"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <main
            className={cn(
                "flex-grow",
                !isAdmin && "pt-[88px] md:pt-[104px]"
            )}
        >
            {children}
        </main>
    );
}
