# TimeGrave API 연동 가이드

## 개요

이 문서는 TimeGrave 프론트엔드를 백엔드 API와 연동하는 방법을 설명합니다.

## 환경 변수 설정

### 개발 환경

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: API Key (if required)
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### 프로덕션 환경

Vercel이나 다른 호스팅 플랫폼에서 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=https://api.timegrave.com/api
NEXT_PUBLIC_API_KEY=your_production_api_key
```

## API 엔드포인트

### Time Capsule API

#### 타임캡슐 생성
```
POST /api/timecapsules
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "openDate": "2025-12-25T00:00:00Z",
  "contents": [File],
  "inviteEmails": ["email@example.com"],
  "isPublic": false
}

Response: 201 Created
{
  "id": "string",
  "title": "string",
  ...
}
```

#### 타임캡슐 조회
```
GET /api/timecapsules/:id

Response: 200 OK
{
  "id": "string",
  "title": "string",
  "description": "string",
  "openDate": "2025-12-25T00:00:00Z",
  "status": "locked" | "unlocked" | "expired",
  "contents": [...],
  "collaborators": [...]
}
```

#### 타임캡슐 목록
```
GET /api/timecapsules
Query Parameters:
  - page: number (default: 1)
  - pageSize: number (default: 10)
  - status: "locked" | "unlocked" | "expired"

Response: 200 OK
{
  "data": [...],
  "total": number,
  "page": number,
  "pageSize": number
}
```

#### 공유 링크 생성
```
POST /api/timecapsules/share
Content-Type: application/json

{
  "timeCapsuleId": "string",
  "permissions": "view" | "edit",
  "expiresAt": "2025-12-31T23:59:59Z" (optional)
}

Response: 200 OK
{
  "shareUrl": "https://timegrave.com/shared/abc123",
  "shareId": "abc123",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

### Notification API

#### 알림 목록 조회
```
GET /api/notifications

Response: 200 OK
[
  {
    "id": "string",
    "type": "capsule_opened" | "invited" | "content_added" | "reminder",
    "title": "string",
    "message": "string",
    "timeCapsuleId": "string",
    "isRead": boolean,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

#### 알림 읽음 처리
```
PUT /api/notifications/:id/read

Response: 200 OK
{
  "success": true
}
```

#### 알림 설정 조회
```
GET /api/notifications/preferences

Response: 200 OK
{
  "capsuleOpened": true,
  "invitations": true,
  "contentAdded": true,
  "reminders": true,
  "collaboratorActivity": true,
  "pushEnabled": false,
  "emailEnabled": true
}
```

#### 알림 설정 업데이트
```
PUT /api/notifications/preferences
Content-Type: application/json

{
  "capsuleOpened": true,
  "invitations": true,
  ...
}

Response: 200 OK
{
  "capsuleOpened": true,
  ...
}
```

## 인증

### JWT 토큰

API 요청 시 Authorization 헤더에 JWT 토큰을 포함하세요:

```typescript
import { apiClient } from '@/lib/api';

// 로그인 후 토큰 설정
apiClient.setAuthToken(token);

// 로그아웃 시 토큰 제거
apiClient.removeAuthToken();
```

### 토큰 갱신

토큰이 만료되면 자동으로 갱신하도록 구현하세요:

```typescript
// src/lib/api/client.ts에서 401 에러 처리
if (response.status === 401) {
  // Refresh token logic
  const newToken = await refreshToken();
  apiClient.setAuthToken(newToken);
  // Retry request
}
```

## 에러 처리

### 에러 코드 매핑

| HTTP Status | Error Code | 설명 |
|------------|------------|------|
| 400 | VALIDATION_ERROR | 잘못된 요청 데이터 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 403 | FORBIDDEN | 권한 없음 |
| 404 | NOT_FOUND | 리소스를 찾을 수 없음 |
| 500 | SERVER_ERROR | 서버 오류 |
| 503 | SERVICE_UNAVAILABLE | 서비스 이용 불가 |

### 에러 응답 형식

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 정보를 확인해주세요.",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

## Mock에서 Real API로 전환

### 1. 환경 변수 설정

`.env.local` 파일에 `NEXT_PUBLIC_API_URL`을 설정하면 자동으로 Real API를 사용합니다.

### 2. API 서비스 확인

```typescript
// src/lib/api/timecapsule.ts
const useMock = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

// useMock이 false면 Real API 사용
```

### 3. 테스트

```bash
# Mock API 사용 (환경 변수 없음)
npm run dev

# Real API 사용 (환경 변수 설정)
NEXT_PUBLIC_API_URL=http://localhost:3001/api npm run dev
```

## 파일 업로드

### Multipart Form Data

파일 업로드 시 `multipart/form-data` 형식을 사용하세요:

```typescript
const formData = new FormData();
formData.append('title', 'My Capsule');
formData.append('description', 'Description');
formData.append('openDate', '2025-12-25');
files.forEach(file => {
  formData.append('files', file);
});

const response = await fetch(`${API_URL}/timecapsules`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    // Content-Type은 자동 설정됨
  },
  body: formData,
});
```

## 웹소켓 (실시간 알림)

### 연결

```typescript
const ws = new WebSocket(`wss://api.timegrave.com/ws?token=${token}`);

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  // Handle notification
};
```

### 메시지 형식

```json
{
  "type": "notification",
  "data": {
    "id": "string",
    "type": "capsule_opened",
    "title": "타임캡슐이 열렸습니다!",
    "message": "...",
    "timeCapsuleId": "string"
  }
}
```

## 체크리스트

백엔드 API 연동 시 확인사항:

- [ ] 환경 변수 설정 완료
- [ ] API 엔드포인트 URL 확인
- [ ] 인증 토큰 처리 구현
- [ ] 에러 핸들링 테스트
- [ ] 파일 업로드 테스트
- [ ] 알림 시스템 테스트
- [ ] 공유 링크 생성/접근 테스트
- [ ] 다운로드 기능 테스트
- [ ] CORS 설정 확인
- [ ] Rate Limiting 확인

## 문의

API 연동 관련 문의사항은 백엔드 팀에게 연락하세요.
