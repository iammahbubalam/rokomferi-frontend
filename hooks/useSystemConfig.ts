import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/utils";

export interface SystemEnums {
    orderStatuses: string[];
    paymentStatuses: string[];
    paymentMethods: string[];
}

async function fetchEnums(): Promise<SystemEnums> {
    const res = await fetch(getApiUrl("/config/enums"));
    if (!res.ok) throw new Error("Failed to fetch config");
    return res.json();
}

export function useSystemConfig() {
    return useQuery({
        queryKey: ["system-config"],
        queryFn: fetchEnums,
        staleTime: 1000 * 60 * 60, // 1 hour (config rarely changes)
    });
}
