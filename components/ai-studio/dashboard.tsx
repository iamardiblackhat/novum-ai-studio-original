"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface DashboardProps {
  onNavigate: (sectionId: string) => void;
}

export function StudioDashboard({ onNavigate }: DashboardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "omnelia-navigate" && e.data.section) {
        onNavigate(e.data.section);
        toast.success(`Switched to ${e.data.section} studio`);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onNavigate]);

  return (
    <div className="relative w-full h-full bg-[#000] overflow-hidden">
      <iframe
        ref={iframeRef}
        src="/dashboard.html"
        title="Omnelia SI Framer Marketplace Dashboard"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
      />
    </div>
  );
}
