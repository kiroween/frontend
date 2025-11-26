# Social Features 설계

## Overview

TimeGrave의 소셜 기능을 구현하여 사용자들이 타임캡슐을 공유하고, 알림을 받으며, 콘텐츠를 다운로드할 수 있도록 합니다. 백엔드 API가 준비되면 즉시 연동 가능하도록 서비스 레이어를 추상화하여 구현합니다.

## Architecture

### 현재 구조
```
src/
├── app/
│   ├── create/          # 타임캡슐 생성
│   ├── graveyard/       # 타임캡슐 목록
│   └── view/[id]/       # 타임캡슐 상세
├── components/
│   ├── create/
│   ├── graveyard/
│   └── resurrection/
└── lib/
    └── utils.ts
```

### 새로운 구조
```
src/
├── app/
│   ├── notifications/   # 알림 페이지 (새로 추가)
│   └── settings/        # 설정 페이지 (새로 추가)
├── components/
│   ├── share/           # 공유 관련 컴포넌트 (새로 추가)
│   ├── notifications/   # 알림 관련 컴포넌트 (새로 추가)
│   └── download/        # 다운로드 관련 컴포넌트 (새로 추가)
├── lib/
│   ├── api/             # API 서비스 레이어 (새로 추가)
│   ├── hooks/           # 커스텀 훅 (새로 추가)
│   └── types/           # TypeScript 타입 정의 (새로 추가)
└── contexts/            # React Context (새로 추가)
    └── NotificationContext.tsx
```

## Components and Interfaces

### 1. Share Components

#### ShareButton Component
```typescript
interface ShareButtonProps {
  timeCapsuleId: string;
  title: string;
  onShare?: (platform: SharePlatform) => void;
}

type SharePlatform = 'link' | 'twitter' | 'facebook' | 'kakao' | 'email';
```

#### ShareModal Component
```typescript
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  timeCapsuleTitle: string;
  collaborators?: Collaborator[];
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
}
```

#### CollaboratorList Component
```typescript
interface CollaboratorListProps {
  collaborators: Collaborator[];
  onRemove?: (collaboratorId: string) => void;
  canManage: boolean;
}
```

### 2. Notification Components

#### NotificationBell Component
```typescript
interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}
```

#### NotificationList Component
```typescript
interface NotificationListProps {
  notifications: Notification[];
  onRead: (notificationId: string) => void;
  onReadAll: () => void;
}

interface Notification {
  id: string;
  type: 'capsule_opened' | 'invited' | 'content_added' | 'reminder';
  title: string;
  message: string;
  timeCapsuleId?: string;
  isRead: boolean;
  createdAt: Date;
}
```

#### NotificationSettings Component
```typescript
interface NotificationSettingsProps {
  settings: NotificationPreferences;
  onUpdate: (settings: NotificationPreferences) => void;
}

interface NotificationPreferences {
  capsuleOpened: boolean;
  invitations: boolean;
  contentAdded: boolean;
  reminders: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}
```

### 3. Download Components

#### DownloadButton Component
```typescript
interface DownloadButtonProps {
  timeCapsuleId: string;
  contents: TimeCapsuleContent[];
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
}

interface TimeCapsuleContent {
  id: string;
  type: 'text' | 'image' | 'video' | 'file';
  name: string;
  url: string;
  size: number;
}
```

#### DownloadModal Component
```typescript
interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  contents: TimeCapsuleContent[];
  onDownload: (options: DownloadOptions) => void;
}

interface DownloadOptions {
  format: 'individual' | 'zip' | 'pdf';
  selectedItems?: string[];
  includeMetadata: boolean;
}
```

## Data Models

### API Service Layer

```typescript
// src/lib/api/client.ts
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

### Time Capsule Models

```typescript
// src/lib/types/timecapsule.ts
interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  openDate: Date;
  createdAt: Date;
  createdBy: string;
  status: 'locked' | 'unlocked' | 'expired';
  contents: TimeCapsuleContent[];
  collaborators: Collaborator[];
  shareUrl?: string;
}

interface CreateTimeCapsuleRequest {
  title: string;
  description: string;
  openDate: Date;
  contents: File[];
  inviteEmails?: string[];
}

interface ShareTimeCapsuleRequest {
  timeCapsuleId: string;
  permissions: 'view' | 'edit';
  expiresAt?: Date;
}

interface ShareTimeCapsuleResponse {
  shareUrl: string;
  shareId: string;
  expiresAt?: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Share link uniqueness
*For any* two different time capsules, the generated share links should be unique and not collide.
**Validates: Requirements 1.2, 7.1**

### Property 2: Clipboard copy feedback
*For any* successful clipboard copy operation, the user should receive immediate visual feedback within 100ms.
**Validates: Requirements 1.4, 6.1**

### Property 3: Notification delivery
*For any* notification event, if the user has that notification type enabled, they should receive the notification.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 4: Download completeness
*For any* download operation, all selected contents should be included in the downloaded package without data loss.
**Validates: Requirements 4.4, 4.5**

### Property 5: API error handling
*For any* failed API request, the system should display an appropriate error message and not crash.
**Validates: Requirements 5.2, 5.6**

### Property 6: Permission enforcement
*For any* user attempting to access a time capsule, the system should verify their permissions before allowing access.
**Validates: Requirements 7.2**

## Error Handling

### API Errors
```typescript
enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
}

const errorMessages: Record<ApiErrorCode, string> = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  VALIDATION_ERROR: '입력 정보를 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다.',
};
```

### Retry Logic
- 네트워크 오류: 3회 재시도 (exponential backoff)
- 타임아웃: 1회 재시도
- 서버 오류 (5xx): 2회 재시도
- 클라이언트 오류 (4xx): 재시도 없음

### Offline Handling
- 오프라인 감지 시 사용자에게 알림
- 읽기 전용 모드로 전환 (캐시된 데이터 표시)
- 온라인 복귀 시 자동 동기화

## Testing Strategy

### Unit Tests
1. **Share link generation**: 고유한 링크가 생성되는지 테스트
2. **Clipboard API**: 클립보드 복사가 정상 작동하는지 테스트
3. **Notification filtering**: 설정에 따라 알림이 필터링되는지 테스트
4. **Download packaging**: ZIP 파일이 올바르게 생성되는지 테스트
5. **API error handling**: 각 에러 타입이 올바르게 처리되는지 테스트

### Integration Tests
1. **Share flow**: 공유 링크 생성 → 복사 → 방문 전체 플로우
2. **Notification flow**: 이벤트 발생 → 알림 생성 → 표시 → 읽음 처리
3. **Download flow**: 다운로드 요청 → 패키징 → 다운로드 완료

### Manual Tests
1. **소셜 미디어 공유**: 각 플랫폼에서 미리보기가 올바르게 표시되는지 확인
2. **브라우저 푸시 알림**: 다양한 브라우저에서 푸시 알림 테스트
3. **다운로드**: 다양한 파일 타입과 크기로 다운로드 테스트
4. **모바일**: 터치 인터페이스와 공유 기능 테스트

## Implementation Details

### API Service Layer

```typescript
// src/lib/api/client.ts
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  private async handleError(error: unknown): Promise<ApiError> {
    // Error handling logic
  }
}

// src/lib/api/timecapsule.ts
export const timeCapsuleApi = {
  create: (data: CreateTimeCapsuleRequest) => 
    apiClient.request<TimeCapsule>('/api/timecapsules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: string) =>
    apiClient.request<TimeCapsule>(`/api/timecapsules/${id}`),

  share: (data: ShareTimeCapsuleRequest) =>
    apiClient.request<ShareTimeCapsuleResponse>('/api/timecapsules/share', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ... more methods
};
```

### Share Implementation

```typescript
// src/components/share/ShareButton.tsx
export function ShareButton({ timeCapsuleId, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const response = await timeCapsuleApi.share({
        timeCapsuleId,
        permissions: 'view',
      });
      setShareUrl(response.data.shareUrl);
      setIsOpen(true);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleShare} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Share'}
      </Button>
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        shareUrl={shareUrl}
        timeCapsuleTitle={title}
      />
    </>
  );
}
```

### Notification Context

```typescript
// src/contexts/NotificationContext.tsx
interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // WebSocket or polling for real-time notifications
  useEffect(() => {
    // TODO: Connect to backend notification service
    // For now, use mock data or localStorage
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ... implementation

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
```

### Download Implementation

```typescript
// src/lib/download.ts
export async function downloadTimeCapsule(
  contents: TimeCapsuleContent[],
  options: DownloadOptions
): Promise<void> {
  if (options.format === 'individual') {
    for (const content of contents) {
      await downloadFile(content.url, content.name);
    }
  } else if (options.format === 'zip') {
    const zip = new JSZip();
    
    for (const content of contents) {
      const blob = await fetch(content.url).then(r => r.blob());
      zip.file(content.name, blob);
    }

    if (options.includeMetadata) {
      const metadata = generateMetadata(contents);
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'timecapsule.zip');
  } else if (options.format === 'pdf') {
    // Generate PDF from text contents
    const pdf = await generatePDF(contents);
    downloadBlob(pdf, 'timecapsule.pdf');
  }
}

function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}
```

## Performance Optimization

1. **Lazy Loading**: 공유/알림/다운로드 컴포넌트는 필요할 때만 로드
2. **Debouncing**: 알림 폴링은 debounce 적용
3. **Caching**: API 응답은 적절히 캐싱
4. **Optimistic Updates**: 사용자 액션에 즉각 반응 (낙관적 업데이트)
5. **Web Workers**: 대용량 파일 다운로드/압축은 Web Worker 사용

## Security Considerations

1. **CSRF Protection**: API 요청에 CSRF 토큰 포함
2. **XSS Prevention**: 사용자 입력은 sanitize
3. **Rate Limiting**: 클라이언트 측에서도 요청 제한
4. **Secure Storage**: 민감한 데이터는 secure storage 사용
5. **HTTPS Only**: 모든 API 통신은 HTTPS

## Mock Data Strategy

백엔드 API가 준비될 때까지 Mock 데이터 사용:

```typescript
// src/lib/api/mock.ts
export const mockTimeCapsuleApi = {
  create: async (data: CreateTimeCapsuleRequest) => {
    await delay(1000); // Simulate network delay
    return {
      data: {
        id: generateId(),
        ...data,
        status: 'locked',
        createdAt: new Date(),
        collaborators: [],
      },
      status: 200,
    };
  },
  // ... more mock methods
};

// Development mode에서만 mock 사용
export const timeCapsuleApi = 
  process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL
    ? mockTimeCapsuleApi
    : realTimeCapsuleApi;
```

## Migration Path

백엔드 API 연동 시:

1. `.env` 파일에 `NEXT_PUBLIC_API_URL` 설정
2. Mock API를 Real API로 교체
3. 인증 토큰 처리 추가
4. 에러 코드 매핑 확인
5. 통합 테스트 실행

```typescript
// Before (Mock)
const response = await mockTimeCapsuleApi.create(data);

// After (Real API)
const response = await timeCapsuleApi.create(data);
// 코드 변경 없음! 같은 인터페이스 사용
```
