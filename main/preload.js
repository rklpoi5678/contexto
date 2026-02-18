// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer, webUtils } = require("electron");

console.log("Preload script loaded!");

contextBridge.exposeInMainWorld("electronAPI", {
  analyzeMeeting: (text) => ipcRenderer.invoke("analyze-meeting", text),
  // STT
  transcribeAudio: (filePath) =>
    ipcRenderer.invoke("transcribe-audio", filePath),
  getFilePath: (file) => webUtils.getPathForFile(file),
  // 텍스트 저장
  saveTxtFile: (content) => ipcRenderer.invoke("save-txt-file", content),
  // 실시간 분석
  analyzeRealtime: (text) => ipcRenderer.invoke("analyze-realtime", text),
});
