// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload script loaded!")

contextBridge.exposeInMainWorld("electronAPI", {
  analyzeMeeting: (text) => ipcRenderer.invoke("analyze-meeting", text),
});
