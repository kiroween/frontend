# Implementation Plan

- [x] 1. 타입 변환 유틸리티 구현





  - snake_case와 camelCase 간 변환 함수 작성
  - 날짜 문자열을 Date 객체로 변환하는 함수 작성
  - 중첩된 객체와 배열 처리 지원
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 1.1 타입 변환 유틸리티 Property 테스트 작성





  - **Property 3: Request data transformation (camelCase to snake_case)**
  - **Property 4: Response data transformation (snake_case to camelCase)**
  - **Property 12: ISO date string conversion**
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. API Client 개선





  - 백엔드 응답 형식 `{status, data: {result}}` 처리 로직 추가
  - 백엔드 에러 형식 `{status, error: {code, message}}` 처리 로직 추가
  - 한글 에러 메시지 추출 및 표시
  - Authorization 헤더 자동 주입 기능 개선
  - _Requirements: 5.1, 5.2, 5.3, 7.2_

- [x] 2.1 API Client Property 테스트 작성






  - **Property 8: Success response unwrapping**
  - **Property 9: Error response extraction**
  - **Property 11: Backend error message passthrough**
  - _Requirements: 5.1, 5.2, 7.2_

- [x] 3. 토큰 저장소 유틸리티 구현





  - localStorage에 세션 토큰 저장/조회/삭제 함수 작성
  - 토큰 만료 시간 확인 함수 작성
  - 토큰 만료 시 자동 삭제 로직 추가
  - _Requirements: 1.3, 1.4_

- [x] 3.1 토큰 저장소 Unit 테스트 작성






  - 토큰 저장 및 조회 테스트
  - 토큰 삭제 테스트
  - 토큰 만료 확인 테스트
  - _Requirements: 1.3, 1.4_

- [x] 4. 인증 API 서비스 구현





  - `src/lib/api/auth.ts` 파일 생성
  - 회원가입 API 함수 구현 (POST /api/users)
  - 로그인 API 함수 구현 (POST /api/users/sign-in)
  - 로그아웃 API 함수 구현 (POST /api/users/sign-out)
  - 회원탈퇴 API 함수 구현 (DELETE /api/users)
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 4.1 인증 API Unit 테스트 작성






  - 회원가입 성공 케이스 테스트
  - 로그인 성공 케이스 테스트
  - 로그인 실패 (401) 케이스 테스트
  - 로그아웃 테스트
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 5. Graves API 서비스 구현





  - `src/lib/api/graves.ts` 파일 생성
  - 타임캡슐 생성 API 함수 구현 (POST /api/graves)
  - 타임캡슐 목록 조회 API 함수 구현 (GET /api/graves)
  - 개별 타임캡슐 조회 API 함수 구현 (GET /api/graves/{id})
  - 백엔드 Tombstone 타입을 프론트엔드 TimeCapsule 타입으로 변환
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 8.4_

- [x] 5.1 Graves API Property 테스트 작성






  - **Property 13: Tombstone to TimeCapsule mapping**
  - _Requirements: 8.4_

- [x] 5.2 Graves API Unit 테스트 작성






  - 타임캡슐 생성 성공 케이스 테스트
  - 타임캡슐 생성 실패 (400) 케이스 테스트
  - 타임캡슐 목록 조회 테스트
  - 개별 타임캡슐 조회 테스트
  - 타임캡슐 조회 실패 (404, 403) 케이스 테스트
  - _Requirements: 2.1, 2.4, 3.1, 4.1, 4.2, 4.3_

- [x] 6. Auth Context 구현





  - `src/contexts/AuthContext.tsx` 파일 생성
  - 사용자 인증 상태 관리 (user, isAuthenticated, isLoading)
  - signUp, signIn, signOut, deleteAccount 함수 구현
  - 로그인 성공 시 토큰 저장 및 API Client에 설정
  - 로그아웃 시 토큰 삭제 및 API Client에서 제거
  - _Requirements: 1.3, 1.4_

- [x] 6.1 Auth Context Property 테스트 작성











  - **Property 1: Token persistence and inclusion**
  - _Requirements: 1.3_

- [x] 7. 401 Unauthorized 처리 구현





  - API Client에 401 응답 인터셉터 추가
  - 401 발생 시 토큰 삭제 및 로그인 페이지로 리다이렉트
  - _Requirements: 1.5_

- [x] 7.1 Unauthorized 처리 Property 테스트 작성






  - **Property 2: Unauthorized redirect**
  - _Requirements: 1.5_

- [x] 8. 에러 처리 개선





  - 에러 타입별 한글 메시지 매핑 추가
  - 네트워크 오류 처리 개선
  - 타임아웃 오류 처리 개선
  - 서버 오류(500) 처리 개선
  - _Requirements: 5.4, 7.1, 7.3, 7.4_

- [x] 8.1 에러 처리 Property 테스트 작성






  - **Property 10: Error message localization**
  - _Requirements: 7.1_

- [x] 8.2 에러 처리 Unit 테스트 작성






  - 네트워크 오류 메시지 테스트
  - 타임아웃 오류 메시지 테스트
  - 서버 오류 메시지 테스트
  - _Requirements: 5.4, 7.3, 7.4_

- [x] 9. 타임캡슐 UI 컴포넌트 업데이트





  - 잠긴 타임캡슐: 내용 숨기고 남은 일수 표시
  - 잠금 해제된 타임캡슐: 전체 내용 표시
  - 잠금 상태에 따른 UI 렌더링 로직 추가
  - _Requirements: 3.3, 3.4, 4.4_

- [x] 9.1 타임캡슐 UI Property 테스트 작성






  - **Property 5: Locked capsule content hiding**
  - **Property 6: Unlocked capsule content display**
  - **Property 7: Lock status UI rendering**
  - _Requirements: 3.3, 3.4, 4.4_

- [x] 10. 환경 변수 설정





  - `.env.local` 파일 생성 (gitignore에 이미 포함됨)
  - `NEXT_PUBLIC_API_URL=http://localhost:8000` 설정
  - API Client가 환경 변수를 올바르게 사용하는지 확인
  - _Requirements: 6.1, 6.4_

- [x] 10.1 환경 변수 Unit 테스트 작성






  - 환경 변수 설정 시 Real API 사용 테스트
  - 환경 변수 미설정 시 Mock API 사용 테스트
  - _Requirements: 6.1, 6.2_

- [x] 11. 회원가입 페이지 연동





  - 회원가입 폼 제출 시 실제 API 호출
  - 성공 시 로그인 페이지로 이동
  - 실패 시 에러 메시지 표시
  - _Requirements: 1.1_

- [x] 12. 로그인 페이지 연동





  - 로그인 폼 제출 시 실제 API 호출
  - 성공 시 토큰 저장 및 메인 페이지로 이동
  - 실패 시 에러 메시지 표시
  - _Requirements: 1.2, 1.3_

- [x] 13. 타임캡슐 생성 페이지 연동





  - 생성 폼 제출 시 실제 API 호출
  - 데이터를 백엔드 형식으로 변환하여 전송
  - 성공 시 묘지 목록 페이지로 이동 및 성공 메시지 표시
  - 실패 시 에러 메시지 표시
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 14. 묘지 목록 페이지 연동





  - 페이지 로드 시 실제 API 호출하여 타임캡슐 목록 조회
  - 백엔드 응답을 프론트엔드 타입으로 변환
  - 잠금 상태에 따라 적절한 UI 렌더링
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 15. 타임캡슐 상세 페이지 연동





  - 페이지 로드 시 실제 API 호출하여 타임캡슐 상세 정보 조회
  - 404, 403 에러 처리
  - 잠금 상태에 따라 적절한 UI 렌더링
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 16. Checkpoint - 모든 테스트 통과 확인





  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. 통합 테스트 및 최종 검증





  - 백엔드 Docker 컨테이너 실행 확인
  - 프론트엔드에서 실제 API 호출 테스트
  - 회원가입 → 로그인 → 타임캡슐 생성 → 목록 조회 → 상세 조회 플로우 테스트
  - 에러 케이스 테스트 (잘못된 입력, 권한 없음 등)
  - 로그아웃 및 401 리다이렉트 테스트
  - _Requirements: All_
