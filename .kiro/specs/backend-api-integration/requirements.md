# Requirements Document

## Introduction

TimeGrave 프론트엔드와 백엔드 API를 연동하여 실제 서버와 통신할 수 있도록 합니다. 현재 프론트엔드는 Mock API를 사용하고 있으며, 백엔드는 FastAPI로 구현되어 Docker로 실행 중입니다. 이 기능은 사용자 인증, 타임캡슐(묘지) 관리 등 모든 API 엔드포인트를 실제 백엔드와 연동합니다.

## Glossary

- **Frontend**: Next.js 기반의 TimeGrave 웹 애플리케이션
- **Backend**: FastAPI 기반의 TimeGrave API 서버
- **API Client**: 백엔드와 통신하는 프론트엔드 HTTP 클라이언트
- **Tombstone**: 타임캡슐을 의미하는 백엔드 용어 (프론트엔드에서는 TimeCapsule)
- **Grave**: 묘지, 백엔드 API 엔드포인트에서 사용하는 용어
- **Session Token**: 사용자 인증을 위한 JWT 토큰
- **Mock API**: 개발 중 사용하는 가짜 API 응답

## Requirements

### Requirement 1: 사용자 인증 API 연동

**User Story:** 사용자로서, 회원가입과 로그인을 통해 내 계정으로 타임캡슐을 관리하고 싶습니다.

#### Acceptance Criteria

1. WHEN 사용자가 회원가입 폼을 제출하면 THEN the Frontend SHALL POST 요청을 `/api/users` 엔드포인트로 전송하고 성공 시 사용자 정보를 받습니다
2. WHEN 사용자가 로그인 폼을 제출하면 THEN the Frontend SHALL POST 요청을 `/api/users/sign-in` 엔드포인트로 전송하고 세션 토큰을 받습니다
3. WHEN 로그인에 성공하면 THEN the Frontend SHALL 세션 토큰을 로컬 스토리지에 저장하고 이후 모든 API 요청에 포함합니다
4. WHEN 로그아웃 버튼을 클릭하면 THEN the Frontend SHALL POST 요청을 `/api/users/sign-out` 엔드포인트로 전송하고 로컬 스토리지의 토큰을 삭제합니다
5. WHEN API가 401 Unauthorized 응답을 반환하면 THEN the Frontend SHALL 사용자를 로그인 페이지로 리다이렉트합니다

### Requirement 2: 타임캡슐 생성 API 연동

**User Story:** 사용자로서, 새로운 타임캡슐을 생성하여 백엔드 서버에 저장하고 싶습니다.

#### Acceptance Criteria

1. WHEN 사용자가 타임캡슐 생성 폼을 제출하면 THEN the Frontend SHALL POST 요청을 `/api/graves` 엔드포인트로 전송하고 생성된 타임캡슐 정보를 받습니다
2. WHEN 타임캡슐 생성 요청을 보낼 때 THEN the Frontend SHALL 제목(title), 내용(content), 잠금 해제 날짜(unlock_date)를 백엔드 스키마에 맞게 변환하여 전송합니다
3. WHEN 백엔드가 201 Created 응답을 반환하면 THEN the Frontend SHALL 성공 메시지를 표시하고 사용자를 묘지 목록 페이지로 이동시킵니다
4. WHEN 백엔드가 400 Bad Request 응답을 반환하면 THEN the Frontend SHALL 유효성 검증 오류 메시지를 사용자에게 표시합니다

### Requirement 3: 타임캡슐 목록 조회 API 연동

**User Story:** 사용자로서, 내가 생성한 모든 타임캡슐 목록을 조회하고 싶습니다.

#### Acceptance Criteria

1. WHEN 사용자가 묘지 목록 페이지에 접근하면 THEN the Frontend SHALL GET 요청을 `/api/graves` 엔드포인트로 전송하고 타임캡슐 목록을 받습니다
2. WHEN 백엔드 응답을 받으면 THEN the Frontend SHALL 백엔드 스키마(TombstoneResponseDto)를 프론트엔드 타입(TimeCapsule)으로 변환합니다
3. WHEN 타임캡슐이 잠겨있으면(is_unlocked: false) THEN the Frontend SHALL 남은 일수(days_remaining)를 표시하고 내용(content)을 숨깁니다
4. WHEN 타임캡슐이 잠금 해제되었으면(is_unlocked: true) THEN the Frontend SHALL 전체 내용(content)을 표시합니다

### Requirement 4: 개별 타임캡슐 조회 API 연동

**User Story:** 사용자로서, 특정 타임캡슐의 상세 정보를 조회하고 싶습니다.

#### Acceptance Criteria

1. WHEN 사용자가 타임캡슐 카드를 클릭하면 THEN the Frontend SHALL GET 요청을 `/api/graves/{grave_id}` 엔드포인트로 전송하고 타임캡슐 상세 정보를 받습니다
2. WHEN 백엔드가 404 Not Found 응답을 반환하면 THEN the Frontend SHALL "타임캡슐을 찾을 수 없습니다" 메시지를 표시합니다
3. WHEN 백엔드가 403 Forbidden 응답을 반환하면 THEN the Frontend SHALL "접근 권한이 없습니다" 메시지를 표시합니다
4. WHEN 타임캡슐 상세 정보를 받으면 THEN the Frontend SHALL 잠금 상태에 따라 적절한 UI를 렌더링합니다

### Requirement 5: API 응답 형식 처리

**User Story:** 개발자로서, 백엔드의 표준화된 응답 형식을 프론트엔드에서 일관되게 처리하고 싶습니다.

#### Acceptance Criteria

1. WHEN 백엔드가 성공 응답을 반환하면 THEN the Frontend SHALL `{status, data: {result}}` 형식에서 실제 데이터를 추출합니다
2. WHEN 백엔드가 에러 응답을 반환하면 THEN the Frontend SHALL `{status, error: {code, message}}` 형식에서 에러 정보를 추출합니다
3. WHEN API 클라이언트가 응답을 처리할 때 THEN the Frontend SHALL 백엔드 응답 구조를 프론트엔드 ApiResponse 타입으로 변환합니다
4. WHEN 네트워크 오류가 발생하면 THEN the Frontend SHALL 사용자에게 "네트워크 연결을 확인해주세요" 메시지를 표시합니다

### Requirement 6: 환경 설정 및 배포

**User Story:** 개발자로서, 개발 환경과 프로덕션 환경에서 다른 API URL을 사용하고 싶습니다.

#### Acceptance Criteria

1. WHEN 환경 변수 `NEXT_PUBLIC_API_URL`이 설정되어 있으면 THEN the Frontend SHALL 해당 URL을 백엔드 API 베이스 URL로 사용합니다
2. WHEN 환경 변수가 설정되지 않았고 개발 모드이면 THEN the Frontend SHALL Mock API를 사용합니다
3. WHEN 프로덕션 빌드를 생성할 때 THEN the Frontend SHALL 환경 변수가 올바르게 설정되었는지 검증합니다
4. WHEN Docker로 백엔드를 실행 중이면 THEN the Frontend SHALL `http://localhost:8000`을 기본 API URL로 사용합니다

### Requirement 7: 에러 처리 및 사용자 피드백

**User Story:** 사용자로서, API 요청이 실패했을 때 명확한 피드백을 받고 싶습니다.

#### Acceptance Criteria

1. WHEN API 요청이 실패하면 THEN the Frontend SHALL 에러 타입에 따라 적절한 한글 메시지를 표시합니다
2. WHEN 백엔드가 한글 에러 메시지를 반환하면 THEN the Frontend SHALL 해당 메시지를 그대로 사용자에게 표시합니다
3. WHEN 타임아웃이 발생하면 THEN the Frontend SHALL "요청 시간이 초과되었습니다" 메시지를 표시합니다
4. WHEN 서버 오류(500)가 발생하면 THEN the Frontend SHALL "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요" 메시지를 표시합니다

### Requirement 8: 데이터 타입 변환

**User Story:** 개발자로서, 백엔드와 프론트엔드의 다른 명명 규칙을 자동으로 변환하고 싶습니다.

#### Acceptance Criteria

1. WHEN 백엔드 응답을 받으면 THEN the Frontend SHALL snake_case 필드명을 camelCase로 변환합니다
2. WHEN 프론트엔드에서 요청을 보낼 때 THEN the Frontend SHALL camelCase 필드명을 snake_case로 변환합니다
3. WHEN 날짜 필드를 처리할 때 THEN the Frontend SHALL ISO 8601 형식 문자열을 Date 객체로 변환합니다
4. WHEN 백엔드의 Tombstone 타입을 받으면 THEN the Frontend SHALL 이를 TimeCapsule 타입으로 매핑합니다
