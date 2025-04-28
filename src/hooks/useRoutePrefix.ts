import {useLocation} from "react-router-dom";

export const AVAILABLE_PREFIXES  = ["staff-consult"] as const;
export type AvailablePrefix = typeof AVAILABLE_PREFIXES[number];

export function useRoutePrefix() {
    const { pathname } = useLocation();

    const foundPrefix = AVAILABLE_PREFIXES.find(prefix => pathname.startsWith(`/${prefix}`));
    
    return {
        prefix: foundPrefix as AvailablePrefix | null,
    };
}