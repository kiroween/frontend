# Soul Particles Enhancement 구현 태스크

- [x] 1. SoulParticles 컴포넌트에 마우스 추적 기능 추가





  - Particle 인터페이스에 baseVx, baseVy 속성 추가
  - useState로 마우스 위치 상태 관리 (초기값: {x: -1000, y: -1000})
  - mousemove 이벤트 리스너 추가 (passive: true)
  - touchmove 이벤트 리스너 추가 (passive: true)
  - 컴포넌트 언마운트 시 이벤트 리스너 정리
  - _Requirements: 1.1, 1.4, 3.3_
- [x] 2. 입자 밀어내기(Repulsion) 물리 로직 구현










- [ ] 2. 입자 밀어내기(Repulsion) 물리 로직 구현

  - 상수 정의: REPULSION_RADIUS (150), REPULSION_STRENGTH (0.5), RETURN_SPEED (0.05)
  - animate 함수 내에서 각 입자에 대해 마우스와의 거리 계산
  - 거리가 REPULSION_RADIUS 이내일 때 밀어내는 힘 적용
  - 정규화된 방향 벡터 계산 및 거리 반비례 힘 적용
  - 마우스가 멀 때 원래 속도로 부드럽게 복귀하는 로직 구현
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2.1 마우스 인터랙션 수동 테스트









  - 브라우저에서 마우스를 움직여 입자들이 자연스럽게 피하는지 확인
  - 마우스가 멀어질 때 입자들이 원래 움직임으로 복귀하는지 확인
  - 모바일에서 터치 이벤트가 정상 작동하는지 확인

- [x] 3. Stone Gate 배경 투명도 조정













  - page.tsx에서 Stone Gate div의 배경 클래스 수정
  - `from-stone-800/40 to-stone-900/60`을 `from-stone-800/20 to-stone-900/30`으로 변경
  - 텍스트 가독성 유지 확인
  - _Requirements: 2.1, 2.2, 2.3, 2.4_



- [x] 3.1 배경 투명도 시각적 테스트








  - 브라우저에서 Stone Gate 뒤의 입자들이 보이는지 확인
  - TIMEGRAVE 텍스트와 다른 콘텐츠의 가독성이 유지되는지 확인
  - 전체적인 시각적 조화 확인
-

- [x] 4. 성능 최적화 및 최종 점검








- [ ] 4. 성능 최적화 및 최종 점검

  - 개발자 도구로 FPS 모니터링 (60fps 유지 확인)
  - 다양한 화면 크기에서 테스트
  - 모바일 기기에서 성능 확인
  - _Requirements: 3.1, 3.2_
