# TimeGrave 디자인 가이드라인

## 핵심 테마

"Ethereal & Mystical (신비롭고 영적인)"

TimeGrave는 단순한 공포가 아닌, 죽음과 기억에 대한 경외감을 주는 디자인을 지향합니다.

## 컬러 팔레트

```css
--deep-void: #050505; /* 배경 - 깊이감 있는 칠흑색 */
--fog-gray: #2a2a2a; /* 안개 효과 (투명도 30%) */
--soul-blue: #4a90e2; /* 영혼의 빛 (Glow) */
--seal-gold: #ffd700; /* 봉인/중요 버튼 */
```

## 타이포그래피

- 제목: Cinzel (명조체 느낌)
- 본문: Inter (고딕체)

## 주요 화면 구성

### Scene 1: The Gate (랜딩 페이지)

- 어두운 안개로 뒤덮인 화면
- 마우스 움직임에 반응하여 안개가 걷힘
- 고대 돌문(Stone Gate) 연출
- 푸른 빛의 입자(Soul Particles) 애니메이션

### Scene 2: The Graveyard (나의 묘지)

- 3D 비석(Tombstone) 그리드 레이아웃
- 잠긴 비석: 쇠사슬, 어두운 느낌
- 열린 비석: 금이 간 틈으로 빛이 새어나옴

### Scene 3: The Ritual (매장 의식)

- 크립텍스(Cryptex) 스타일 날짜 선택기
- 엄숙한 의식 느낌의 UI/UX

### Scene 4: Resurrection (부활)

- 화이트아웃 효과
- AI 생성 낡은 사진 (Sepia, Time-Rot)
- 유령 목소리 재생

## 개발 원칙

- 모든 애니메이션은 부드럽고 신비로운 느낌 유지
- 인터랙션은 의미있고 몰입감 있게
- 성능 최적화를 통한 부드러운 경험 제공
