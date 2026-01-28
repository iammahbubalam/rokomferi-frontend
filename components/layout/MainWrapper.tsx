"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainWrapperProps {
    children: React.ReactNode;
}

export const MainWrapper = ({ children }: MainWrapperProps) => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <main
            className={cn(
                "flex-grow",
                !isAdmin && "pt-[64px] md:pt-[48px]"
            )}
        >
            {children}
        </main>
    );
};
