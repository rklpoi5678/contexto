declare global {
  interface Window {
    electronAPI: {
      analyzeMeeting: (text: string) => Promise<{
        summary: string;
        pareto: string;
        firstPrinciples: string;
        feynman: string;
      }>;
    };
  }
}

export {};
