# TimeGrave MVP 설계

## 아키텍처

### 프론트엔드 구조

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # 랜딩 페이지 (The Gate)
│   ├── graveyard/    # 묘지 대시보드
│   ├── ritual/       # 타임캡슐 생성
│   └── resurrection/ # 타임캡슐 열람
├── components/       # 재사용 컴포넌트
│   ├── ui/          # shadcn/ui 컴포넌트
│   ├── animations/  # 애니메이션 컴포넌트
│   └── layouts/     # 레이아웃 컴포넌트
├── lib/             # 유틸리티
└── styles/          # 전역 스타일
```

## 주요 컴포넌트

### P-001: SoulParticles

영혼의 입자 애니메이션 컴포넌트

- Canvas 기반 파티클 시스템
- 마우스 인터랙션

### P-002: TombstoneCard

비석 카드 컴포넌트

- 잠금/해제 상태 표시
- 호버 효과
- 날짜 카운트다운

### P-003: CryptexDatePicker

크립텍스 스타일 날짜 선택기

- 드래그 인터랙션
- 햅틱 피드백 (모바일)

### P-004: FogEffect

안개 효과 컴포넌트

- CSS/Canvas 기반
- 마우스 움직임에 반응

## 상태 관리

- React Context API 사용
- 타임캡슐 데이터 관리
- 사용자 인증 상태

## 스타일링 전략

- Tailwind CSS 커스텀 테마
- CSS 변수로 컬러 팔레트 관리
- 애니메이션은 Framer Motion 고려

## 성능 최적화

- 이미지 최적화 (Next.js Image)
- 코드 스플리팅
- 애니메이션 최적화 (requestAnimationFrame)
