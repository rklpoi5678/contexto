"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Target, Lightbulb, MessageCircle } from "lucide-react";
import FileUploadModal from "@/components/layout/FileUploadModal";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "요약",
      icon: <Target className="w-6 h-6" />,
      desc: "핵심 줄거리를 파악합니다.",
    },
    {
      title: "파레토 80/20",
      icon: <Zap className="w-6 h-6" />,
      desc: "임팩트 있는 20%를 찾습니다.",
    },
    {
      title: "원리 사고",
      icon: <Lightbulb className="w-6 h-6" />,
      desc: "근본 원인을 작게 작게 분석합니다.",
    },
    {
      title: "파인만 기법",
      icon: <MessageCircle className="w-6 h-6" />,
      desc: "쉽게 설명하고 가공합니다.",
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="px-6 pt-24 pb-16 mx-auto max-w-5xl text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 md:text-6xl">
          컨텍스토 긴 회의의 끝, 복기
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600">
          4가지 사고 프레임워크로 가공합니다.
        </p>
        <div className="flex gap-4 justify-center">
          <FileUploadModal />
          <Link href="/ai-trans">
            <Button
              size="lg"
              variant="default"
              className="px-8 py-6 text-lg rounded-full"
            >
              ai모델로 음성을 텍스트로 변환하기
            </Button>
          </Link>
          <Link href="/local-trans">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg rounded-full"
            >
              로컬 모델 사용 음성 텍스트로 변환하기
            </Button>
          </Link>
          <Link href="/realtime-assistant">
            <Button
              size="lg"
              variant="default"
              className="px-8 py-6 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              실시간 회의 도우미 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white">
        <div className="grid grid-cols-1 gap-6 px-6 mx-auto max-w-6xl md:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="p-6 border-none shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex justify-center items-center mb-4 w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                {f.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
              <p className="text-slate-500">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
