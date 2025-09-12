"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

type SalesTab = {
  _id: string;
  title: string;
  isCoupon?: boolean;
  couponCode?: string;
  percentOff?: number;
};

const AUTO_INTERVAL_MS = 3500;

export default function SalesTabs() {
  const [tabs, setTabs] = useState<SalesTab[]>([]);
  const [active, setActive] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const res = await fetch("/api/sales-tabs", { cache: "no-store" });
        const data = await res.json();
        setTabs(Array.isArray(data.tabs) ? data.tabs.slice(0, 5) : []);
      } catch (e) {
        setTabs([]);
      }
    };
    fetchTabs();
  }, []);

  useEffect(() => {
    if (tabs.length === 0) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % tabs.length);
    }, AUTO_INTERVAL_MS);
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [tabs]);

  if (!tabs || tabs.length === 0) return null;

  const current = tabs[active];
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="w-full bg-[#f7f7f7] border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 text-xs text-gray-700">
          <button
            aria-label="Previous"
            className="px-2 py-1 text-gray-500 hover:text-black"
            onClick={() => setActive((prev) => (prev - 1 + tabs.length) % tabs.length)}
          >
            ‹
          </button>
          <div className="flex items-center gap-3">
            <span className="font-medium font-poppins text-gray-800">
              {current?.title}
            </span>
            {current?.isCoupon && current?.couponCode ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] bg-black text-white rounded-none tracking-wide">
                  {current.couponCode}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 rounded-none text-xs"
                  onClick={() => copyCode(current.couponCode!)}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            ) : null}
          </div>
          <button
            aria-label="Next"
            className="px-2 py-1 text-gray-500 hover:text-black"
            onClick={() => setActive((prev) => (prev + 1) % tabs.length)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}


