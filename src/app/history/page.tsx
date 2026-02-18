"use client";

import {
  Search,
  Filter,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const historyData = [
  { id: 1, title: "주간 제품 씽크업", date: "2024.05.20", duration: "45m", items: 12, decisions: 4, type: "정기 회의" },
  { id: 2, title: "Contexto 디자인 리뷰", date: "2024.05.19", duration: "60m", items: 8, decisions: 2, type: "디자인" },
  { id: 3, title: "마케팅 전략 수립", date: "2024.05.18", duration: "90m", items: 15, decisions: 5, type: "전략" },
  { id: 4, title: "개발팀 스프린트 플래닝", date: "2024.05.15", duration: "30m", items: 20, decisions: 8, type: "개발" },
  { id: 5, title: "브랜드 아이덴티티 논의", date: "2024.05.14", duration: "120m", items: 5, decisions: 1, type: "디자인" },
];

export default function HistoryPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">회의 히스토리</h1>
        <p className="text-slate-500 mt-1">과거의 모든 회의 분석 결과를 한눈에 확인하세요.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="회의 제목이나 키워드로 검색..."
            className="pl-10 border-slate-200 focus-visible:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex gap-2">
            <Filter className="w-4 h-4" /> 필터
          </Button>
          <Button variant="outline" className="flex gap-2">
            <Calendar className="w-4 h-4" /> 날짜순
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm font-medium">
              <th className="px-6 py-4">회의 제목</th>
              <th className="px-6 py-4">날짜</th>
              <th className="px-6 py-4">소요 시간</th>
              <th className="px-6 py-4">주요 항목</th>
              <th className="px-6 py-4">유형</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {historyData.map((meeting) => (
              <tr key={meeting.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-900">{meeting.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{meeting.date}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{meeting.duration}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-normal text-[10px] text-slate-400">
                      액션 {meeting.items}
                    </Badge>
                    <Badge variant="outline" className="font-normal text-[10px] text-orange-400 border-orange-100">
                      결정 {meeting.decisions}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-medium">
                    {meeting.type}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href="/start">
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                        리포트 보기 <ArrowUpRight className="ml-1 w-3 h-3" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">총 5개의 리포트 중 5개 표시</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>이전</Button>
          <Button variant="outline" size="sm" disabled>다음</Button>
        </div>
      </div>
    </div>
  );
}
