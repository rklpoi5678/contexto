declare global {
  interface Window {
    electronAPI: {
      analyzeMeeting: (text: string) => Promise<{
        summary: string;
        pareto: string;
        firstPrinciples: string;
        feynman: string;
      }>;
      /** OPENAI */
      transcribeAudio: (filePath: string) => Promise<string>;
      getFilePath: (file: File) => string;
      saveTxtFile: (
        content: string
      ) => Promise<{ success: boolean; path?: string }>;
      analyzeRealtime: (text: string) => Promise<{
        flowchart: Array<{ id: number; label: string; next?: number }>;
        insight: string;
        nextStep: string;
      }>;
    };
  }
  interface ElectronFile extends File {
    path: string;
  }
}

export {};
