# Contexto (v1.0.0)
Contexto는 회의 녹취록을 Gemini 2.0 Flash AI 와 추후 OpenRouter등으로 분석하여 회의록을 4가지 프레임워크로 재구성해주는 next기반 일렉트론 애플리케이션입니다. 단순한 요약을 넘어, 의사결정과 문제 해결에 필요한 인사이트를 제공해주는 역할을 기대하고있습니다.

## 주요 기능
Summary: 전체 회의의 핵심 줄거리와 맥락을 한눈에 파악합니다.

Pareto: 80%의 결과를 만들어내는 핵심적인 20%의 원인과 결정 사항을 추출합니다.

First Principles: 근본적인 원인과 원칙을 바탕으로 문제를 분해하고 작은 핵심 탐구합니다.

Feynman: 복잡한 기술적 내용을 누구나 이해할 수 있는 쉬운 비유로 설명합니다.

## 기타
Frontend: Next.js 15+, React 19, Tailwind CSS
Desktop: Electron
AI: Google Gemini 2.0 Flash API
Runtime: Bun

---

## 시작하기 (개발자 모드)
1. 환경 변수 설정
.env.exapmle 을 참고하여 프로젝트 루트에 .env 파일을 생성하고 Gemini API 키를 입력합니다.

``` Bash
// 코드 스니펫
GOOGLE_GENERATIVE_AI_KEY=your_api_key_here
```

## 의존성 설치 및 실행

``` Bash
# 패키지 설치
bun install
```

```Bash
# 실행 (Next.js + Electron (Nextron)동시 실행)
bun run electron:dev
```

>📦 빌드 및 배포 (Linux)
현재 베타 버전으로, 리눅스 환경(Arch Linux 포함)에서 .AppImage 빌드를 지원합니다.

``` Bash
# 빌드 실행
bun run electron:build
```
빌드 완료 후 dist/ 폴더 내의 .AppImage 파일을 확인하세요.

🐧 리눅스 실행 시 주의사항
아치 리눅스 커널 보안 정책에 따라 실행 시 --no-sandbox 옵션이 필요할 수 있습니다.

>chmod +x Contexto-0.1.0.AppImage
./Contexto-0.1.0.AppImage --no-sandbox

---

⚠️ 알려진 이슈 (Beta)
GTK Warning: 실행 시 터미널에 나타나는 GTK 테마 관련 경고는 무시해도 무방하며 앱 동작에는 영향을 주지 않습니다.

GPU 가속: 일부 리눅스 환경에서 창이 뜨지 않는 문제를 방지하기 위해 하드웨어 가속이 기본적으로 꺼져 있습니다.

다른 플랫폼호환: 현재 개발환경은 상관없지만 빌드는 linux에서만 확인을 하였습니다.

---

📝 라이선스
MIT License
