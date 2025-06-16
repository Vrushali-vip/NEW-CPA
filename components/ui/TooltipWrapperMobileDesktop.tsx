import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TooltipWrapperMobileDesktop({ t }: { t: any }) {
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Tooltip open={isMobile ? open : undefined} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onClick={() => isMobile && setOpen(!open)}
                    onMouseEnter={() => !isMobile && setOpen(true)}
                    onMouseLeave={() => !isMobile && setOpen(false)}
                    className="cursor-pointer"
                >
                    <Info className="w-4 h-4 text-red" aria-label="Transit Info" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" sideOffset={4}>
                <div
                    className="bg-muted px-3 py-2 text-sm shadow max-w-[60vw] md:max-w-[360px] text-center md:text-left"
                    style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
                >
                    {t("insuranceForm.addTransitCoverTooltip")}
                </div>
            </TooltipContent>

        </Tooltip>
    );
}
