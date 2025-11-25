# TimeGrave 🪦

> 과거를 묻고, 미래를 부활하라

TimeGrave는 미래에 열리는 타임캡슐 서비스입니다. 신비롭고 영적인 경험을 통해 당신의 기억을 묻고, 정해진 시간이 되면 부활시킬 수 있습니다.

## 🎨 디자인 컨셉

**Ethereal & Mystical (신비롭고 영적인)**

단순한 공포가 아닌, 죽음과 기억에 대한 경외감을 주는 디자인을 지향합니다.

### 컬러 팔레트

- **Deep Void** (#050505): 깊이감 있는 칠흑색 배경
- **Fog Gray** (#2a2a2a): 은은한 안개 효과
- **Soul Blue** (#4a90e2): 영혼의 푸른 빛
- **Seal Gold** (#ffd700): 봉인의 금색

### 타이포그래피

- 제목: Cinzel (명조체)
- 본문: Inter (고딕체)

## 🚀 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Runtime**: React 19

## 📦 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

## 🗺️ 주요 화면

### Scene 1: The Gate (랜딩 페이지)

- 어두운 안개와 영혼의 입자
- 고대 돌문 연출
- "ENTER GRAVE" 버튼

### Scene 2: The Graveyard (나의 묘지)

- 3D 비석 그리드 레이아웃
- 잠긴/열린 비석 상태 표시
- 날짜 카운트다운

### Scene 3: The Ritual (매장 의식)

- 크립텍스 스타일 날짜 선택기
- 파일 업로드
- 친구 초대 기능

### Scene 4: Resurrection (부활)

- 화이트아웃 효과
- AI 처리된 콘텐츠
- 다운로드 기능

## 📁 프로젝트 구조

```
.
├── .kiro/                  # Kirowin 해커톤 요구사항
│   ├── specs/             # 프로젝트 스펙
│   ├── hooks/             # Agent hooks
│   └── steering/          # 개발 가이드라인
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React 컴포넌트
│   └── lib/               # 유틸리티
└── public/                # 정적 파일
```

## 🏆 Kirowin Hackathon

이 프로젝트는 Kirowin 해커톤을 위해 제작되었습니다.
`.kiro` 디렉토리는 specs, hooks, steering 사용 내역을 보여주기 위해 포함되어 있습니다.

## 📄 라이선스

MIT License
