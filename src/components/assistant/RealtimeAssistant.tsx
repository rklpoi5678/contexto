"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, MessageSquare, Lightbulb, GitBranch, PlayCircle, StopCircle } from "lucide-react";

interface FlowNode {
  id: number;
  label: string;
  next?: number;
}

interface AnalysisResult {
  flowchart: FlowNode[];
  insight: string;
  nextStep: string;
}

type SpeechRecognitionResultLike = { transcript: string };
type SpeechRecognitionResultListLike = ArrayLike<ArrayLike<SpeechRecognitionResultLike>>;
type SpeechRecognitionEventLike = { resultIndex: number; results: SpeechRecognitionResultListLike };
type SpeechRecognitionErrorEventLike = { error: string };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export default function RealtimeAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const lastAnalysisTranscriptRef = useRef("");
  const transcriptRef = useRef("");
  const isAnalyzingRef = useRef(false);

  // Keep transcriptRef in sync with transcript state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as Window & {webkitSpeechRecognition?: SpeechRecognitionConstructor; SpeechRecognition?: SpeechRecognitionConstructor;}).webkitSpeechRecognition || (window as Window & { SpeechRecognition?: SpeechRecognitionConstructor}).SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "ko-KR";

        recognitionRef.current.start = () => {
          setIsRecording(true);
          setError(null);
        };

        recognitionRef.current.stop = () => {
          setIsRecording(false);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEventLike) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          // Only add if it's not just repeating the same thing
          setTranscript(prev => {
              if (prev.endsWith(currentTranscript.trim())) return prev;
              const newTranscript = prev + " " + currentTranscript;
              // Cap transcript at 15000 chars to protect UI performance
              const MAX_TRANSCRIPT_LENGTH = 15000;
              if (newTranscript.length > MAX_TRANSCRIPT_LENGTH) {
                return newTranscript.slice(-MAX_TRANSCRIPT_LENGTH);
              }
              return newTranscript;
          });
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEventLike) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'no-speech') return;
          
          // Handle permission-related errors explicitly
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setError("마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.");
          } else {
            setError(`음성 인식 오류: ${event.error}`);
          }
          setIsRecording(false);
        };
      } else {
        setSpeechSupported(false);
        setError("이 브라우저는 음성 인식을 지원하지 않습니다.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        isRecording &&
        !isAnalyzingRef.current &&
        transcriptRef.current.length > lastAnalysisTranscriptRef.current.length + 50
      ) {
        handleAnalyze();
      }
    }, 15000); // Analyze every 15 seconds if transcript grows

    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        setError("음성 인식이 초기화되지 않았습니다.");
        return;
      }
      
      setTranscript("");
      setAnalysis(null);
      lastAnalysisTranscriptRef.current = "";
      setError(null);
      
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition", err);
        setError("음성 인식을 시작할 수 없습니다. 마이크 권한을 확인해주세요.");
        setIsRecording(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!transcriptRef.current || isAnalyzingRef.current) return;

    setIsAnalyzing(true);
    isAnalyzingRef.current = true;
    try {
      if (window.electronAPI) {
        // Send only the delta (new content since last analysis)
        const deltaText = transcriptRef.current.slice(lastAnalysisTranscriptRef.current.length);
        
        if (!deltaText.trim()) {
          console.log("No new content to analyze");
          return;
        }
        
        const result = await window.electronAPI.analyzeRealtime(deltaText);
        setAnalysis(result);
        lastAnalysisTranscriptRef.current = transcriptRef.current;
      }
    } catch (error) {
      console.error("Analysis error", error);
    } finally {
      setIsAnalyzing(false);
      isAnalyzingRef.current = false;
    }
  };

  return (
    <div className="flex relative flex-col w-full h-full bg-slate-50/50 backdrop-blur-sm min-h-[600px] rounded-xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white/80 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-blue-600" />
          실시간 회의 도우미
        </h2>
        <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAnalyze}
              disabled={!isRecording || isAnalyzing}
              className="rounded-full"
            >
                즉시 분석
            </Button>
            <Button
              variant={isRecording ? "destructive" : "default"}
              onClick={toggleRecording}
              disabled={!speechSupported}
              className="rounded-full px-6 transition-all hover:scale-105"
            >
              {isRecording ? (
                <><StopCircle className="mr-2 h-5 w-5" /> 중지</>
              ) : (
                <><PlayCircle className="mr-2 h-5 w-5" /> 시작</>
              )}
            </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden h-[400px]">
        {/* Left: Transcript */}
        <div className="flex flex-col p-4 w-1/3 border-r border-slate-200 bg-white/30 overflow-y-auto">
          <h3 className="mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4" /> 실시간 대화 기록
          </h3>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {transcript || (isRecording ? "대화를 기다리는 중..." : "시작 버튼을 눌러주세요.")}
          </div>
        </div>

        {/* Right: Flowchart */}
        <div className="relative flex flex-col p-4 w-2/3 bg-white/20 overflow-y-auto">
          <h3 className="mb-6 text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> 대화 흐름 (Flow Chart)
          </h3>
          <div className="flex flex-col items-center justify-start flex-1 space-y-4 pb-8">
            {analysis?.flowchart && analysis.flowchart.length > 0 ? (
              analysis.flowchart.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="px-6 py-3 bg-white border-2 border-blue-400 rounded-2xl shadow-md text-blue-800 font-bold min-w-[200px] text-center animate-in fade-in zoom-in duration-500 hover:border-blue-600 transition-colors">
                    {node.label}
                  </div>
                  {node.next && (
                    <div className="w-1 h-8 bg-blue-400 relative">
                       <div className="absolute bottom-0 -left-1.5 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-blue-400"></div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                <GitBranch className="w-12 h-12 mb-2 opacity-20" />
                <p>충분한 대화가 쌓이면 흐름도가 그려집니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Insights & Next Steps */}
      <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 transition-all hover:shadow-md">
            <h4 className="flex items-center gap-2 mb-2 font-bold text-indigo-700">
              <Lightbulb className="w-5 h-5" /> 주요 인사이트
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {analysis?.insight || "대화 내용을 분석하여 실시간 인사이트를 제공합니다."}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 transition-all hover:shadow-md">
            <h4 className="flex items-center gap-2 mb-2 font-bold text-emerald-700">
              <MessageSquare className="w-5 h-5" /> 추천 질문/멘트
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {analysis?.nextStep || "회의를 원활하게 이끌 수 있는 가이드를 드립니다."}
            </p>
          </div>
        </div>
        {isAnalyzing && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden">
             <div className="w-full h-full bg-blue-500 animate-[progress_2s_infinite_linear] origin-left"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
