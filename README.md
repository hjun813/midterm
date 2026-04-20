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
