import {
  pipeline,
  env,
  AutomaticSpeechRecognitionPipeline,
} from "@huggingface/transformers";

// 로컬 모델 대신 원격 모델 사용 (Hugging Face Hub)
env.allowLocalModels = false;

interface ProgressEvent {
  status: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

/** Pipeline 싱글톤 */
class TranscriptionPipeline {
  static readonly task = "automatic-speech-recognition";
  static readonly model = "Xenova/whisper-tiny";
  static instance: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

  static async getInstance(
    progress_callback?: (event: ProgressEvent) => void
  ): Promise<AutomaticSpeechRecognitionPipeline> {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback }) as Promise<AutomaticSpeechRecognitionPipeline>;
    }
    return this.instance;
  }
}

// 메인 스레드로부터 메시지 수신
self.onmessage = async (event: MessageEvent<{audio: Float32Array}>) => {
  const { audio } = event.data;

  try {
    const transcriber = await TranscriptionPipeline.getInstance((progress: ProgressEvent) => {
      // 모델 로딩 상태를 메인 스레드로 전달
      if (progress.status === "progress" && progress.loaded !== undefined) {
        self.postMessage({
          status: "progress",
          val: Math.round(progress.loaded),
        });
      }
    });

    const output = await transcriber(audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: "korean",
      task: "transcribe",
      return_timestamps: true,
    });

    // 변환 완료 후 결과 전송
    self.postMessage({ status: "complete", output });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    self.postMessage({
      status: "error",
      error: errorMessage,
    });
    console.error("Worker STT Error:", error);
  }
};
