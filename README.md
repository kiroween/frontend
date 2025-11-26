# TimeGrave 🪦

> 과거를 묻고, 미래를 부활하라

TimeGrave는 기억의 사후 세계를 컨셉으로 한 타임캡슐 서비스입니다.

## ✨ 주요 기능

- **매장 의식**: 소중한 기억을 봉인하고 미래의 날짜를 지정
- **크립텍스 날짜 선택**: 신비로운 크립텍스 스타일의 날짜 선택기
- **영혼의 묘지**: 봉인된 기억들을 한눈에 관리
- **부활 애니메이션**: 시간이 되면 극적인 애니메이션과 함께 기억 부활
- **세피아 효과**: 낡은 사진처럼 시간의 흔적이 담긴 콘텐츠 표시

## 🎨 디자인 컨셉

**Ethereal & Mystical (신비롭고 영적인)**

- 단순한 공포가 아닌, 죽음과 기억에 대한 경외감
- 어두운 배경에 푸른 영혼의 빛
- 고대 돌문과 비석 모티브
- 부드럽고 몰입감 있는 애니메이션

## 🚀 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Fonts**: Cinzel (제목), Inter (본문)

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🗂️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 랜딩 페이지 (The Gate)
│   ├── graveyard/         # 묘지 대시보드
│   ├── create/            # 타임캡슐 생성
│   └── view/[id]/         # 타임캡슐 열람
├── components/
│   ├── animations/        # 애니메이션 컴포넌트
│   ├── graveyard/         # 묘지 관련 컴포넌트
│   ├── create/            # 생성 관련 컴포넌트
│   ├── resurrection/      # 부활 관련 컴포넌트
│   ├── ui/                # 공통 UI 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── common/            # 공통 컴포넌트
└── lib/                   # 유틸리티 함수
```

## 🎯 주요 화면

### Scene 1: The Gate (랜딩 페이지)
- 마우스 반응형 안개 효과
- Canvas 기반 영혼의 입자 애니메이션
- 고대 돌문 디자인

### Scene 2: The Graveyard (묘지)
- 3D 비석 그리드 레이아웃
- 잠긴 비석: 쇠사슬과 어두운 느낌
- 열린 비석: 금이 간 틈으로 빛이 새어나옴

### Scene 3: The Ritual (매장 의식)
- 3단계 생성 플로우
- 크립텍스 스타일 날짜 선택기
- 드래그 앤 드롭 파일 업로드

### Scene 4: Resurrection (부활)
- 균열 → 빛 → 화이트아웃 애니메이션
- 세피아 톤의 낡은 사진 효과
- 다운로드 및 다시 묻기 기능

## 🎨 컬러 팔레트

```css
--deep-void: #050505;    /* 배경 - 깊이감 있는 칠흑색 */
--fog-gray: #2a2a2a;     /* 안개 효과 */
--soul-blue: #4a90e2;    /* 영혼의 빛 */
--seal-gold: #ffd700;    /* 봉인/중요 버튼 */
```

## 📱 반응형 디자인

- 모바일, 태블릿, 데스크톱 완벽 지원
- 터치 인터랙션 최적화
- 성능 최적화된 애니메이션

## ♿ 접근성

- ARIA 레이블 적용
- 키보드 네비게이션 지원
- prefers-reduced-motion 지원
- 시맨틱 HTML 구조

## 🔧 최적화

- 폰트 최적화 (display: swap)
- 이미지 lazy loading
- Canvas 애니메이션 최적화
- 이벤트 throttling/debouncing
- will-change 속성 활용

## 📄 라이선스

MIT License

## 👥 팀

TimeGrave Team

---

**기억의 사후 세계에 오신 것을 환영합니다.**
