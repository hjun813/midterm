# 🎓 중간고사 대비 플랫폼 (Midterm Prep Platform)

> 다양한 문제 유형(객관식, OX, 주관식, 서술형)을 지원하는 스마트 시험 대비 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-000000?style=for-the-badge&logo=css-modules&logoColor=white)

## ✨ 핵심 기능

- **다양한 문제 유형 지원**: 객관식(4인용), OX, 단답형, 빈칸 채우기, 서술형 완벽 대응.
- **랜덤 셔플 학습**: Fisher-Yates 알고리즘 기반의 지능형 랜덤 문제 섞기 기능.
- **실전 테스트 모드**: 타이머 기반의 시험 환경 및 자동 채점 리포트 생성.
- **오답 노트 시스템**: 틀린 문제만 모아 따로 복습할 수 있는 영구 저장 로직.
- **데이터 기반 구성**: `src/problem/` 폴더의 JSON 파일만 수정하여 간편하게 문제 은행 업데이트.

## 🚀 시작하기

### 설치
```bash
git clone https://github.com/hjun813/midterm.git
cd midterm
npm install
```

### 실행
```bash
npm run dev
```

### Vercel 링크
https://midterm-ten-sigma.vercel.app

## 📖 사용 가이드
상세한 사용법은 [USAGE_GUIDE.md](./USAGE_GUIDE.md)를 참고해 주세요.

## 📂 프로젝트 구조
- `src/components`: 재사용 가능한 UI 컴포넌트 (`QuestionCard`, `Layout` 등)
- `src/pages`: 주요 서비스 페이지 (`Dashboard`, `StudyMode`, `ExamMode` 등)
- `src/problem`: JSON 문제 데이터 저장소
- `src/context`: 전역 상태 관리 (QuizContext)
- `src/utils`: 공통 유틸리티 (JSON 파서, 셔플 로직 등)

## 🛠️ 기술적 특징
- **Codetree UI 스타일**: 깔끔하고 집중도 높은 학습용 디자인 시스템 적용.
- **Responsive Design**: 다양한 화면 크기에 대응하는 유연한 레이아웃.
- **Safe Type Casting**: TypeScript를 통한 엄격한 데이터 정합성 보장.

---
Created by Antigravity AI.

## PDF 문제 생성 (Gemini)

데이터 관리 화면에서 2MB 이하 PDF를 선택하고 문제 수와 유형을 지정합니다. 생성된 문제와 정답·해설을 확인하고 체크한 문제만 등록할 수 있습니다. 기존 JSON 등록도 계속 사용할 수 있습니다. PDF의 내용은 Google Gemini API로 전송되므로 공유할 수 있는 문서만 사용하세요. 이미지 기반 PDF의 결과는 보장하지 않습니다.

이 구현은 PDF를 **Gemini API에 직접 전달**하며 NotebookLM에 업로드하거나 NotebookLM을 호출하지 않습니다. NotebookLM Enterprise API는 별도 라이선스와 사용자 인증이 필요합니다.

### 로컬 실행

```bash
npm install
npx vercel dev
```

Vercel CLI에 로그인하고 프로젝트를 연결한 후 로컬 환경 변수에 `GEMINI_API_KEY`를 설정하세요. 예를 들어 Vercel 프로젝트에 환경 변수를 등록한 경우 `vercel env pull .env.local`로 내려받을 수 있습니다. `.env.local`을 Git에 커밋하지 마세요. `npm run dev`는 Vite 화면만 실행하므로 `/api/generate-questions` 함수는 제공하지 않습니다.

### Vercel 배포

Vercel 프로젝트의 환경 변수에 `GEMINI_API_KEY`를 서버용으로 설정하고 재배포합니다. Vite 프레임워크의 기본 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`입니다. 키에 `VITE_` 접두사를 붙이지 마세요. 배포와 생성 API 사용에는 Vercel 및 Gemini 계정의 사용량과 비용이 적용될 수 있습니다.

API는 PDF당 2MB, 인스턴스별 IP당 분당 3회로 제한합니다. 이 메모리 기반 제한은 인스턴스 간 공유되지 않고 재시작 시 초기화되므로 전역 쿼터나 악용 방지 수단은 아닙니다. 공개 서비스에는 Vercel 방화벽 등 공유된 외부 제한이 추가로 필요합니다. 생성 결과는 서버에서 Zod로 검사하지만 내용의 정확성은 보장하지 않으므로 등록 전 검토해야 합니다.
