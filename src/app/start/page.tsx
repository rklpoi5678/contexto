"use client";

import { useSyncExternalStore } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Target, Lightbulb, FileSearch } from "lucide-react";

// API 응답 데이터 타입 정의
interface AnalysisResult {
  summary: string;
  pareto: string;
  firstPrinciples: string;
  feynman: string;
}
let lastRawData: string | null = null;
let cachedData: AnalysisResult | null = null;
// 외부 스토어 구독함수
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

// localStorage에서 데이터를 가져오는 스냅샷 함수
function getSnapshot() {
  const item = localStorage.getItem("analysis_result");
  if (!item) return null;
  if (item === lastRawData) {
    return cachedData;
  }

  try {
    lastRawData = item;
    cachedData = JSON.parse(item);
    return cachedData;
  } catch (e) {
    console.error("JSON 파싱 에러:", e);
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

export default function StartPage() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-slate-500">
          데이터를 불러오는 중이거나 분석된 결과가 없습니다.
        </p>
      </div>
    );
  }

  const tabs = [
    {
      id: "summary",
      label: "요약",
      icon: <FileSearch className="w-4 h-4" />,
      content: data.summary,
    },
    {
      id: "pareto",
      label: "파레토 80/20",
      icon: <Target className="w-4 h-4" />,
      content: data.pareto,
    },
    {
      id: "firstPrinciples",
      label: "원리 사고",
      icon: <Brain className="w-4 h-4" />,
      content: data.firstPrinciples,
    },
    {
      id: "feynman",
      label: "파인만 기법",
      icon: <Lightbulb className="w-4 h-4" />,
      content: data.feynman,
    },
  ];

  return (
    <div className="container px-4 py-10 mx-auto max-w-5xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">분석 결과 리포트</h1>
        <p className="text-slate-500">
          사용자의 AI가(개발중) 4가지 사고 프레임워크로 회의를 분석했습니다.
        </p>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-2 p-1 mb-8 w-full h-auto lg:grid-cols-4 bg-slate-100">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white"
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card className="bg-white border-none shadow-md">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="flex gap-2 items-center text-primary">
                  {tab.icon}
                  <CardTitle>{tab.label}</CardTitle>
                </div>
                <CardDescription>
                  {tab.id === "summary" &&
                    "전체 회의의 핵심 줄거리와 맥락을 요약합니다."}
                  {tab.id === "pareto" &&
                    "가장 큰 영향력을 발휘하는 핵심 요소 20%를 추출했습니다."}
                  {tab.id === "firstPrinciples" &&
                    "근본적인 원인과 원칙을 바탕으로 문제를 분해합니다."}
                  {tab.id === "feynman" &&
                    "복잡한 내용을 누구나 이해할 수 있게 쉬운 비유로 설명합니다."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] w-full pr-4">
                  <div className="max-w-none leading-relaxed whitespace-pre-wrap prose prose-slate break-keep">
                    {tab.content}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button variant="outline" onClick={() => window.print()}>
          결과 PDF로 저장하기
        </Button>
      </div>
    </div>
  );
}
