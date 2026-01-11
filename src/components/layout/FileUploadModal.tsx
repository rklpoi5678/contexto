"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X, UploadCloud, Loader2 } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// 파일 검증을 위한 Zod 스키마 (최대 20개, 개별 5MB)
const fileSchema = z
  .array(
    z.custom<File>((val) => val instanceof File, {
      message: "유효한 파일 형식이 아닙니다.",
    })
  )
  .max(20, "최대 20개까지만 업로드 가능합니다.")
  .refine(
    (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
    "각 파일은 5MB 이하여야 합니다."
  );

export default function FileUploadModal() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const result = fileSchema.safeParse(files);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (typeof window !== "undefined" && !window.electronAPI) {
      setError("일렉트론API를 찾을 수 없습니다. 앱을 재시작해 주세요.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      // 모든 파일의 텍스트를 읽어서 하나로 합친다.
      const textPromises = selectedFiles.map((file) => file.text());
      const texts = await Promise.all(textPromises);
      const combinedText = texts.join("\n\n");

      const result = await window.electronAPI.analyzeMeeting(combinedText);

      localStorage.setItem("analysis_result", JSON.stringify(result));
      router.push("/start");
    } catch (error) {
      setError("분석 실패: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="px-8 rounded-full">
          분석 시작하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>회의 녹취록 업로드</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-center items-center w-full">
            <label className="flex flex-col justify-center items-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300">
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <UploadCloud className="mb-2 w-8 h-8 text-slate-500" />
                <p className="text-sm text-slate-500">
                  voice1.txt, voice2.txt 등을 선택하세요
                </p>
                <p className="text-xs text-slate-400">
                  최대 20개, 파일당 5MB 이내
                </p>
              </div>
              <Input
                type="file"
                multiple
                accept=".txt,.md"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {selectedFiles.length > 0 ? (
              <ul className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center p-2 text-sm rounded bg-slate-100"
                  >
                    <div className="flex gap-2 items-center">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="truncate max-w-[300px]">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-16 text-sm text-center text-slate-400">
                선택된 파일이 없습니다.
              </p>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            disabled={selectedFiles.length === 0 || isLoading}
            onClick={startAnalysis}
            className="w-full h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                <span>Gemini가 분석 중...</span>
              </>
            ) : (
              `${selectedFiles.length}개의 파일 분석 시작`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
