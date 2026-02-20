"use client";

import RealtimeAssistant from "@/components/assistant/RealtimeAssistant";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RealtimeAssistantPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-start mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> 뒤로가기
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-6xl flex-1 flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            실시간 회의 어시스턴트
          </h1>
          <p className="text-slate-500">
            실시간으로 대화를 경청하고, 대화의 흐름과 핵심 인사이트를 제공합니다.
          </p>
        </div>

        <div className="flex-1">
          <RealtimeAssistant />
        </div>
      </div>
    </div>
  );
}
