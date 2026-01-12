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
      ) => promise<{ success: boolean; path?: string }>;
    };
  }
  interface ElectronFile extends File {
    path: string;
  }
}

export {};
