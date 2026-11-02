"use client";

import dynamic from "next/dynamic";
import { StudioSkeleton } from "@/components/ai-studio/studio-skeleton";

const StudioApp = dynamic(
  () => import("@/components/ai-studio/studio-app").then((mod) => mod.StudioApp),
  {
    ssr: false,
    loading: () => <StudioSkeleton />,
  }
);

export function ClientPage() {
  return <StudioApp />;
}
