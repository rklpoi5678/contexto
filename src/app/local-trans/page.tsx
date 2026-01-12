"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileAudio, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TransPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string>("");
  const worker = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    worker.current = new Worker(new URL("@/libs/worker.ts", import.meta.url), {
      type: "module",
    });

    worker.current.onmessage = (e: MessageEvent) => {
      const { status, val, output } = e.data;

      if (status === "progress") setProgress(val);
      if (status === "complete") {
        setResult(output.text);
        setStatus("success");
      }
      if (status === "error") {
        alert("에러발생:" + e.data.error);
        setStatus("idle");
      }
    };
    return () => worker.current?.terminate();
  }, []);

  const startTranscription = async (file: File) => {
    setStatus("loading");
    setProgress(0);

    // 음성 파일을 Float32Array로 변환 필요 (Whisper 입력 규격)
    try {
      // 16000Hz 리샘플링
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Whisper모델은 단일 채널(모노) 데이터 사용
      const audioData = audioBuffer.getChannelData(0);

      if (worker.current) {
        worker.current?.postMessage({ audio: audioData });
      }
      await audioContext.close();
    } catch (error) {
      console.error("Audio Processing error:", error);
      alert("오디오 파일을 읽을 수 없습니다. 다른 파일을 시도해 주세요.");
      setStatus("idle");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startTranscription(file);
    }
  };

  return (
    <div className="p-10 mx-auto max-w-4xl">
      <Card className="flex flex-col items-center p-8 border-2 border-dashed">
        <FileAudio className="mb-4 w-12 h-12 text-blue-500" />
        <h2 className="mb-2 text-xl font-bold">음성 파일을 텍스트로 변환</h2>
        <p className="mb-6 text-slate-500">
          로컬 리소스를 사용하여 안전하게 변환합니다.
        </p>

        {/* 실제 파일 선택 인풋 (숨김) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
        />

        {status === "loading" ? (
          <div className="flex flex-col items-center">
            <Loader2 className="mb-2 text-blue-500 animate-spin" />
            <p className="font-medium">변환 중... {progress}%</p>
          </div>
        ) : (
          <Button size="lg" onClick={() => fileInputRef.current?.click()}>
            {status === "success" ? "다시 선택하기" : "파일 선택하기"}
          </Button>
        )}

        {status === "success" && result && (
          <div className="p-4 mt-8 w-full rounded-lg border bg-slate-50">
            <h3 className="mb-2 font-bold">변환 결과:</h3>
            <p className="text-sm leading-relaxed">{result}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
