/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAi = require("openai");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

// 리눅스 GPU 가속 및 샌드박스 문제 방지
// app.disableHardwareAcceleration();

const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });
const openrouter = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY, // Fallback if needed
});
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Fixed from 2.5 to 2.0
  generationConfig: { responseMimeType: "application/json" },
});

function createWindow() {
  console.log("[LOG] 1. 창 생성 프로세스 시작...");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // 로딩 전 깜빡임 방지
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // __dirname은 main 폴더이므로 preload.js가 같은 폴더에 있는지 확인하세요.
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../out/index.html")}`;

  console.log(`[LOG] 로드할 URL: ${startUrl}`);
  win.loadURL(startUrl);

  // 개발자 도구 자동 오픈
  if (isDev) {
    win.webContents.openDevTools();
  }

  // 창이 준비되면 화면에 표시
  win.once("ready-to-show", () => {
    win.show();
  });

  // 로딩 에러 감시
  win.webContents.on("did-fail-load", (e, code, desc) => {
    console.log(`[LOG] 로딩 실패: ${code} (${desc})`);
    console.log(
      "[LOG] Next.js 서버(localhost:3000)가 정상 실행 중인지 확인하세요."
    );
  });
}

app.whenReady().then(() => {
  console.log("[LOG] Ready");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC 핸들러 (회의록 분석 등)
ipcMain.handle("analyze-meeting", async (event, combinedText) => {
  console.log("[LOG] 프레임워크로 분석 요청 수신");

  try {
    const prompt = `
        당신은 회의록 분석 전문가입니다. 제공된 회의록 내용을 바탕으로 다음 4가지 프레임워크를 사용하여 분석하고 반드시 JSON 형식으로 응답하세요.

        1. summary(관기대략): 회의의 전체적인 핵심 줄거리와 맥락 요약.
        2. pareto (파레토 80/20): 가장 큰 영향력을 발휘하는 핵심 요소 20% 추출.
        3. firstPrinciples (원리 사고): 근본적인 원인과 원칙 바탕으로 문제 분해.
        4. feynman (파인만 기법): 복잡한 내용을 누구나 이해할 수 있게 쉬운 비유로 설명.

        응답 형식(JSON):
        {
          "summary" : "내용...",
          "pareto" : "내용...",
          "firstPrinciples" : "내용...',
          "feynman" : "내용..."
        }

        회의록 내용:
        ${combinedText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();

    // JSON 파싱 후 객체로 전달
    const analysisData = JSON.parse(jsonString);
    console.log("파싱 성공");

    return analysisData;
  } catch (error) {
    console.error("분석 에러:", error);
    throw new Error(error.message);
  }
});

/** STT변환 핸들러 (Whisper API) */
ipcMain.handle("transcribe-audio", async (event, filePath) => {
  console.log("STT 변환 요청 수신", filePath);
  if (!openai || !openai.apiKey) {
    console.error(
      "OpenAi API키가 설정되지 않았거나 객체가 생성되지 않았습니다."
    );
    throw new Error("OpenAI 클라이언트 초기화 실패");
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "ko",
    });

    console.log("STT 변환 성공");
    return transcription.text;
  } catch (error) {
    console.log("STT 에러:", error);
    throw new Error(error.message);
  }
});

ipcMain.handle("save-txt-file", async (event, content) => {
  const { filePath } = await dialog.showSaveDialog({
    title: "텍스트 파일 저장",
    defaultPath: path.join(app.getPath("documents"), "transcription.txt"),
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });

  if (filePath) {
    try {
      fs.writeFileSync(filePath, content, "utf8");
      return { success: true, path: filePath };
    } catch (error) {
      console.error("파일 저장 에러", error);
      throw error;
    }
  }
  return { success: true };
});

/** OpenRouter 실시간 분석 핸들러 */
ipcMain.handle("analyze-realtime", async (event, combinedText) => {
  console.log("[LOG] 실시간 분석 요청 수신");
  try {
    const prompt = `
        당신은 실시간 회의 도우미입니다. 현재까지의 대화 내용을 바탕으로 다음을 수행하세요:
        1. 대화의 흐름을 파악하여 간단한 플로우차트 데이터를 생성하세요 (최대 5개 노드).
        2. 현재 대화에서의 주요 인사이트를 추출하세요.
        3. 다음에 어떤 대화를 이어가면 좋을지 제안하세요.

        반드시 JSON 형식으로 응답하세요.
        응답 형식(JSON):
        {
          "flowchart": [
            {"id": 1, "label": "주제 1", "next": 2},
            {"id": 2, "label": "주제 2", "next": 3},
            ...
          ],
          "insight": "현재 주요 내용은...",
          "nextStep": "다음으로는 ...에 대해 이야기해보는 것이 좋습니다."
        }

        회의록 내용:
        ${combinedText}
    `;

    const response = await openrouter.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const analysisData = JSON.parse(response.choices[0].message.content);
    console.log("실시간 분석 파싱 성공");
    return analysisData;
  } catch (error) {
    console.error("실시간 분석 에러:", error);
    throw new Error(error.message);
  }
});
