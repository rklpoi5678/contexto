"use client";

import { useSyncExternalStore } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Target,
  Lightbulb,
  FileSearch,
  Download,
  Share2,
  ListTodo,
  CheckSquare,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
          <FileSearch className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">
          데이터를 불러오는 중이거나 분석된 결과가 없습니다.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          대시보드로 돌아가기
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      id: "summary",
      label: "핵심 요약",
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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-700 border-none">AI Analysis</Badge>
            <span className="text-sm text-slate-400">2024년 5월 20일</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">회의 분석 결과 리포트</h1>
          <p className="text-slate-500">
            4가지 사고 프레임워크를 통해 도출된 심층 분석 데이터입니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-2" onClick={() => window.print()}>
            <Download className="w-4 h-4" /> PDF 저장
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Share2 className="w-4 h-4" /> 공유하기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Tabs Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="flex gap-2 p-1 mb-6 bg-slate-100/50 rounded-xl w-fit">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <div className="p-8">
                    <div className="flex gap-3 items-center mb-6">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        {tab.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{tab.label} 리포트</h2>
                        <p className="text-sm text-slate-500">
                          {tab.id === "summary" && "전체 회의의 핵심 줄거리와 맥락"}
                          {tab.id === "pareto" && "영향력이 가장 큰 핵심 요소 20%"}
                          {tab.id === "firstPrinciples" && "근본 원인 중심의 문제 분해"}
                          {tab.id === "feynman" && "누구나 이해하기 쉬운 핵심 개념"}
                        </p>
                      </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                      <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 min-h-[400px]">
                        <p className="leading-relaxed whitespace-pre-wrap text-slate-700 selection:bg-indigo-100">
                          {tab.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-3 flex flex-row items-center gap-2">
              <ListTodo className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">액션 아이템</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 rounded-lg border border-slate-50 bg-slate-50/30">
                  <CheckSquare className="w-4 h-4 text-slate-300 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Q3 로드맵 업데이트</p>
                    <p className="text-xs text-slate-400 mt-1">담당: 기획팀 / 기한: ~05.25</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-3 rounded-lg border border-slate-50 bg-slate-50/30">
                  <CheckSquare className="w-4 h-4 text-slate-300 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">디자인 시스템 가이드 보완</p>
                    <p className="text-xs text-slate-400 mt-1">담당: 디자인팀 / 기한: ~05.30</p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-xs text-indigo-600 hover:bg-indigo-50">
                아이템 추가하기 +
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-3 flex flex-row items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg">주요 결정 사항</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="text-sm text-slate-600 pl-4 border-l-2 border-orange-200 py-1">
                  모바일 첫 화면 진입 속도 개선 우선순위 상향
                </li>
                <li className="text-sm text-slate-600 pl-4 border-l-2 border-orange-200 py-1">
                  신규 피처 A/B 테스트 6월 중순 시작
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
