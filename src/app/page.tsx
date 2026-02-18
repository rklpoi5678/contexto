"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Calendar,
  MoreVertical
} from "lucide-react";
import FileUploadModal from "@/components/layout/FileUploadModal";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const stats = [
    { title: "분석된 회의", value: "24", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "절약된 시간", value: "12.5h", icon: Clock, color: "text-green-600", bg: "bg-green-100" },
    { title: "결정된 사항", value: "86", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "커뮤니케이션 효율", value: "+22%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const recentMeetings = [
    { id: 1, title: "주간 제품 씽크업", date: "2024.05.20", status: "분석 완료", tags: ["제품", "기획"] },
    { id: 2, title: "Contexto 디자인 리뷰", date: "2024.05.19", status: "분석 완료", tags: ["디자인", "UI/UX"] },
    { id: 3, title: "마케팅 전략 수립", date: "2024.05.18", status: "분석 완료", tags: ["마케팅", "Q3"] },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">안녕하세요, SaaS User님! 👋</h1>
          <p className="text-slate-500 mt-1">오늘도 효율적인 협업을 위해 Contexto가 준비되어 있습니다.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/ai-trans">
            <Button variant="outline" className="flex gap-2">
              <Plus className="w-4 h-4" /> 음성 파일 변환
            </Button>
          </Link>
          <FileUploadModal />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-normal">이번 달</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">최근 회의 리포트</h2>
            <Link href="/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{meeting.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">{meeting.date}</span>
                        <div className="flex gap-1">
                          {meeting.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-700 border-none hover:bg-green-100 font-medium">
                      {meeting.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-slate-400 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Required / Tips */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">알림 및 팁</h2>
          <Card className="border-none shadow-sm bg-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">AI 추천 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-100 text-sm leading-relaxed">
                최근 3번의 회의에서 &quot;의사결정 보류&quot; 항목이 많아지고 있습니다. 다음 회의 전 미리 아젠다를 공유하여 결정 효율을 높여보세요.
              </p>
              <Button className="w-full mt-4 bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                리포트 분석하기
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                지연된 액션 아이템
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm text-slate-600 leading-tight">UI 시안 컨펌 피드백 전달</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <p className="text-sm text-slate-600 leading-tight">개발팀 리소스 할당 체크</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
