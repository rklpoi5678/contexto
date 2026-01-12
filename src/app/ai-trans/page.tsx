"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileAudio, Loader2, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";

export default function TransPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [result, setResult] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startTranscription = async (file: File) => {
    setStatus("loading");
    setResult("");

    try {
      let resultText = "";

      if (window.electronAPI) {
        const electronFile = window.electronAPI.getFilePath(file);
        if (electronFile) {
          console.log("Electron 로컬 경로 처리:", electronFile);
          resultText = await window.electronAPI.transcribeAudio(electronFile);
        } else {
          throw new Error(
            "Electron 환경이지만 파일 경로(path)를 읽을 수 없습니다."
          );
        }
      } else {
        // 웹 환경
        const formData = new FormData();
        formData.append("file", file);
      }

      setResult(resultText);
      setStatus("success");
    } catch (error) {
      console.error("STT Error:", error);
      alert(error instanceof Error ? error.message : "STT 에러발생");
      setStatus("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startTranscription(file);
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 min-h-screen bg-slate-50">
      <Card className="p-8 w-full max-w-2xl bg-white border-none shadow-lg">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-4 mb-4 bg-blue-50 rounded-full">
            <FileAudio className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Whisper AI 변환</h1>
          <p className="mt-2 text-slate-500">
            음성 파일을 하이퍼클로바급 텍스트로 즉시 변환합니다.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*,video/*"
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {status === "loading" ? (
            <div className="flex flex-col items-center p-10">
              <Loader2 className="mb-4 w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-lg font-medium animate-pulse text-slate-700">
                AI가 음성을 분석하고 있습니다...
              </p>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full py-6 text-lg font-semibold transition-all hover:scale-[1.01]"
              onClick={() => fileInputRef.current?.click()}
            >
              파일 업로드 (MP3, WAV, M4A...)
            </Button>
          )}
        </div>

        {status === "success" && (
          <div className="mt-10 duration-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-2 items-center mb-3 font-bold text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span>변환 완료</span>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl opacity-25 blur transition duration-1000 group-hover:opacity-50"></div>
              <div className="relative p-6 bg-white border border-slate-200 rounded-xl shadow-inner min-h-[200px] max-h-[400px] overflow-y-auto">
                <p className="leading-relaxed whitespace-pre-wrap text-slate-800 selection:bg-blue-100">
                  {result}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Button
                variant="default"
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={async () => {
                  if (window.electronAPI) {
                    const res = await window.electronAPI.saveTxtFile(result);
                    if (res.success) alert("파일이 저장되었습니다.");
                  }
                }}
              >
                TXT 파일로 저장하기
              </Button>
            </div>
            <Button
              variant="ghost"
              className="mt-6 w-full text-slate-500 hover:text-blue-600"
              onClick={() => setStatus("idle")}
            >
              새로 변환하기
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
