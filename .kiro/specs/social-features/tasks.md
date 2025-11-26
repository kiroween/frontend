# Social Features 구현 태스크

## Phase 1: 프로젝트 구조 및 타입 정의

- [x] 1. 프로젝트 구조 설정 및 타입 정의


  - src/lib/types/ 디렉토리 생성
  - TimeCapsule, Notification, Collaborator 등 타입 정의
  - API 요청/응답 인터페이스 정의
  - _Requirements: 5.1, 5.5_




- [ ] 2. API 서비스 레이어 구축
  - src/lib/api/ 디렉토리 생성
  - ApiClient 클래스 구현 (fetch wrapper, timeout, error handling)
  - Mock API 서비스 구현 (개발용)
  - Real API 서비스 인터페이스 정의
  - 환경 변수 기반 API 전환 로직


  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 2.1 API 서비스 레이어 단위 테스트
  - ApiClient 에러 핸들링 테스트


  - Timeout 로직 테스트
  - Retry 로직 테스트
  - Mock/Real API 전환 테스트


## Phase 2: 공유 기능 구현

- [ ] 3. 공유 링크 생성 기능
  - ShareButton 컴포넌트 구현
  - 공유 링크 생성 API 호출
  - 로딩 상태 처리
  - _Requirements: 1.1, 1.2_



- [ ] 4. ShareModal 컴포넌트 구현
  - 모달 UI 구현 (TimeGrave 디자인 테마)
  - 공유 링크 표시



  - 링크 복사 기능 (Clipboard API)
  - 복사 성공 피드백 (토스트 알림)
  - 소셜 미디어 공유 버튼 (Twitter, Facebook, KakaoTalk)
  - _Requirements: 1.3, 1.4, 2.1, 2.2, 6.1_



- [ ] 5. 협력자 관리 기능
  - CollaboratorList 컴포넌트 구현
  - 협력자 목록 표시


  - 협력자 제거 기능 (권한 확인)
  - _Requirements: 1.6_

- [ ] 6. 소셜 미디어 메타데이터
  - Open Graph 메타 태그 추가


  - Twitter Card 메타 태그 추가
  - 동적 메타데이터 생성 (Next.js generateMetadata)
  - _Requirements: 2.3, 2.4_


- [ ] 6.1 공유 기능 통합 테스트
  - 공유 링크 생성 플로우 테스트
  - 클립보드 복사 테스트
  - 소셜 미디어 공유 테스트

## Phase 3: 알림 시스템 구현



- [ ] 7. Notification Context 구현
  - NotificationContext 생성
  - 알림 상태 관리 (useState)
  - 알림 추가/읽음 처리 함수
  - LocalStorage 기반 알림 저장 (임시)
  - _Requirements: 3.1, 3.2, 3.3_




- [ ] 8. NotificationBell 컴포넌트
  - 헤더에 알림 벨 아이콘 추가
  - 읽지 않은 알림 카운트 배지
  - 클릭 시 알림 목록 드롭다운


  - _Requirements: 3.4_

- [x] 9. NotificationList 컴포넌트


  - 알림 목록 UI 구현
  - 알림 타입별 아이콘 및 스타일
  - 읽음/읽지 않음 상태 표시
  - 알림 클릭 시 해당 페이지로 이동
  - 모두 읽음 처리 버튼


  - _Requirements: 3.4_

- [ ] 10. 알림 설정 페이지
  - src/app/settings/notifications/page.tsx 생성

  - NotificationSettings 컴포넌트 구현
  - 알림 타입별 토글 스위치
  - 브라우저 푸시 알림 권한 요청
  - 설정 저장 기능
  - _Requirements: 3.5, 3.6_



- [ ] 11. 브라우저 푸시 알림 (선택적)
  - Service Worker 등록
  - Push API 권한 요청
  - 푸시 알림 수신 처리
  - _Requirements: 3.6_



- [ ] 11.1 알림 시스템 통합 테스트
  - 알림 생성 및 표시 테스트


  - 읽음 처리 테스트
  - 설정 저장/불러오기 테스트

## Phase 4: 다운로드 기능 구현


- [ ] 12. 다운로드 유틸리티 함수
  - src/lib/download.ts 생성
  - downloadFile 함수 구현
  - downloadBlob 함수 구현


  - JSZip 라이브러리 설치 및 설정
  - _Requirements: 4.3, 4.4_



- [ ] 13. DownloadButton 컴포넌트
  - 다운로드 버튼 UI 구현
  - 다운로드 옵션 메뉴 (개별/전체/PDF)
  - 다운로드 진행 상태 표시



  - _Requirements: 4.1, 4.2, 4.6_

- [ ] 14. ZIP 다운로드 기능
  - 여러 파일을 ZIP으로 패키징
  - 메타데이터 포함 옵션


  - 진행률 표시
  - _Requirements: 4.4_

- [x] 15. PDF 생성 기능


  - jsPDF 또는 html2pdf 라이브러리 설치
  - 텍스트 콘텐츠를 PDF로 변환
  - TimeGrave 스타일 적용
  - _Requirements: 4.5_


- [ ] 15.1 다운로드 기능 테스트
  - 개별 파일 다운로드 테스트
  - ZIP 다운로드 테스트
  - PDF 생성 테스트

## Phase 5: UI 통합 및 개선


- [ ] 16. 기존 페이지에 공유 기능 추가
  - view/[id]/page.tsx에 ShareButton 추가
  - graveyard/page.tsx에 공유 상태 표시
  - create/page.tsx에 초대 옵션 추가

  - _Requirements: 1.1_

- [ ] 17. 기존 페이지에 다운로드 기능 추가
  - view/[id]/page.tsx에 DownloadButton 추가
  - 타임캡슐 오픈 상태 확인

  - 권한 확인 (소유자/협력자만)
  - _Requirements: 4.1_

- [ ] 18. 레이아웃에 알림 벨 추가
  - layout.tsx 또는 헤더 컴포넌트에 NotificationBell 추가

  - NotificationProvider로 앱 감싸기
  - _Requirements: 3.4_

- [ ] 19. 토스트 알림 시스템
  - Toast 컴포넌트 구현
  - ToastContext 생성


  - 성공/에러/정보 메시지 표시
  - _Requirements: 6.1, 6.2_

- [ ] 20. 오프라인 감지 및 처리
  - 네트워크 상태 감지 훅 (useOnlineStatus)

  - 오프라인 배너 컴포넌트
  - 오프라인 시 API 호출 방지
  - _Requirements: 6.5_

## Phase 6: 보안 및 권한 관리



- [ ] 21. 권한 확인 로직
  - 타임캡슐 접근 권한 확인 함수
  - 협력자 권한 확인 (owner/editor/viewer)
  - 보호된 라우트 구현
  - _Requirements: 7.2_




- [ ] 22. 공유 링크 보안
  - UUID 기반 공유 ID 생성
  - 공유 링크 만료 처리
  - 무효화된 링크 처리
  - _Requirements: 7.1, 7.4_

- [ ] 23. 데이터 검증 및 Sanitization
  - 사용자 입력 검증
  - XSS 방지 (DOMPurify 등)
  - 파일 업로드 검증
  - _Requirements: 7.3_

## Phase 7: 최적화 및 테스트

- [ ] 24. 성능 최적화
  - 컴포넌트 lazy loading (React.lazy)
  - API 응답 캐싱 (SWR 또는 React Query)
  - 이미지 최적화 (Next.js Image)
  - _Requirements: 6.3_

- [ ] 25. 반응형 디자인 점검
  - 모바일에서 공유 기능 테스트
  - 터치 인터페이스 최적화
  - 작은 화면에서 알림 UI 확인
  - _Requirements: 6.4_

- [ ] 26. 접근성 개선
  - ARIA 레이블 추가
  - 키보드 네비게이션 지원
  - 스크린 리더 테스트
  - _Requirements: 6.1_

- [ ] 27. E2E 테스트
  - 공유 플로우 E2E 테스트
  - 알림 플로우 E2E 테스트
  - 다운로드 플로우 E2E 테스트

## Phase 8: 문서화 및 배포 준비

- [ ] 28. API 연동 가이드 작성
  - API_INTEGRATION.md 문서 작성
  - 환경 변수 설정 가이드
  - Mock에서 Real API로 전환 방법
  - 에러 코드 매핑 테이블
  - _Requirements: 5.5_

- [ ] 29. 컴포넌트 문서화
  - Storybook 설정 (선택적)
  - 주요 컴포넌트 사용 예제
  - Props 문서화
  - _Requirements: 6.1_

- [ ] 30. README 업데이트
  - 새로운 기능 설명 추가
  - 설치 및 실행 가이드 업데이트
  - 스크린샷 추가
  - _Requirements: 6.1_

## Checkpoint

- [ ] 31. 최종 점검
  - 모든 기능이 정상 작동하는지 확인
  - 브라우저 호환성 테스트 (Chrome, Firefox, Safari)
  - 모바일 기기 테스트 (iOS, Android)
  - 성능 메트릭 확인
  - 빌드 에러 없는지 확인
