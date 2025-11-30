# TimeGrave Frontend Scripts

이 폴더에는 테스트 실행, 검증, 유틸리티 스크립트들이 정리되어 있습니다.

## 📁 스크립트 분류

### 🧪 테스트 실행 스크립트 (`run-*`)

#### 전체 테스트
- `run-all-tests.ps1` - 모든 테스트 실행
- `run-test.bat` - 기본 테스트 실행
- `run-tests.js` - Node.js 테스트 러너

#### API 테스트
- `run-api-test.bat` / `.ps1` - API 클라이언트 테스트
- `run-client-test.bat` - API 클라이언트 기본 테스트
- `run-client-error-test.ps1` - API 에러 처리 테스트
- `run-client-property-test.ps1` - API Property 테스트

#### 인증 테스트
- `run-auth-test.bat` - 인증 API 테스트
- `run-authcontext-test.bat` / `.ps1` / `.js` - AuthContext 테스트
- `run-token-test.bat` - 토큰 저장소 테스트

#### Graves(타임캡슐) 테스트
- `run-graves-test.bat` / `.ps1` - Graves API 전체 테스트
- `run-graves-unit-test.bat` - Graves API 유닛 테스트

#### UI 테스트
- `run-ui-tests.bat` - UI 컴포넌트 테스트
- `run-ui-property-tests.js` / `.ps1` - UI Property 테스트

#### 통합 테스트
- `run-integration-test.bat` - 통합 테스트 실행

#### 환경 변수 테스트
- `run-env-test.bat` / `.ps1` - 환경 변수 설정 테스트

### ✅ 검증 스크립트 (`verify-*`)
- `verify-backend.ps1` - 백엔드 서버 실행 확인
- `verify-env.js` - 환경 변수 설정 확인

### 🛠️ 유틸리티 스크립트
- `test-property-10.js` - Property 10 테스트
- `install-and-test.bat` - 의존성 설치 및 테스트 실행

## 🚀 사용 방법

### Windows Command Prompt
```cmd
cd frontend\scripts
run-test.bat
```

### PowerShell
```powershell
cd frontend/scripts
.\run-all-tests.ps1
```

### Node.js 스크립트
```bash
cd frontend/scripts
node run-tests.js
```

## 📝 스크립트 작성 규칙

### 파일명 규칙
- `run-[테스트명].bat` - Windows 배치 스크립트
- `run-[테스트명].ps1` - PowerShell 스크립트
- `run-[테스트명].js` - Node.js 스크립트
- `verify-[대상].ps1` - 검증 스크립트

### 스크립트 구조
각 테스트 스크립트는 다음을 포함해야 합니다:
1. 작업 디렉토리 설정 (frontend 루트로)
2. 환경 확인 (필요시)
3. 테스트 실행 명령
4. 결과 출력

### 예시: run-example-test.bat
```batch
@echo off
cd /d "%~dp0\.."
echo Running example tests...
call npm test -- src/lib/example/__tests__/example.test.ts
```

### 예시: run-example-test.ps1
```powershell
# Run example tests
Set-Location $PSScriptRoot\..
Write-Host "Running example tests..." -ForegroundColor Green
npm test -- src/lib/example/__tests__/example.test.ts
```

## 🔧 스크립트 유지보수

### 새 테스트 추가 시
1. 테스트 파일 작성: `src/**/__tests__/*.test.ts`
2. 실행 스크립트 작성: `scripts/run-[테스트명].bat` 및 `.ps1`
3. 이 README에 스크립트 추가
4. 테스트 실행 확인

### 스크립트 수정 시
1. 배치 파일과 PowerShell 파일 모두 수정
2. 경로가 올바른지 확인 (`cd /d "%~dp0\.."` 또는 `Set-Location $PSScriptRoot\..`)
3. 테스트 실행 확인

### 스크립트 삭제 시
1. 해당 테스트가 더 이상 필요없는지 확인
2. 관련 문서에서 참조 제거
3. 스크립트 파일 삭제

## 📚 관련 문서

- `/docs/testing/` - 테스트 관련 문서
- `/docs/guides/` - 테스트 가이드 및 체크리스트
- `../README.md` - 프로젝트 전체 README

## 🔗 테스트 파일 위치

실제 테스트 코드는 다음 위치에 있습니다:
- `/src/**/__tests__/*.test.ts` - 유닛 테스트
- `/src/**/__tests__/*.test.tsx` - 컴포넌트 테스트

## ⚙️ 환경 설정

### 필수 환경 변수
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 백엔드 실행
테스트 실행 전 백엔드가 실행 중이어야 합니다:
```bash
cd backend
docker-compose up -d
```

### 검증
```powershell
.\verify-backend.ps1
```

## 🐛 문제 해결

### 스크립트 실행 권한 오류 (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 경로 오류
- 스크립트는 `frontend/scripts/` 폴더에서 실행되어야 합니다
- 스크립트 내부에서 자동으로 `frontend/` 루트로 이동합니다

### 테스트 실패
1. 백엔드 실행 확인: `.\verify-backend.ps1`
2. 환경 변수 확인: `.\verify-env.js`
3. 의존성 재설치: `npm install`
4. 캐시 삭제: `npm test -- --clearCache`

## 📊 테스트 커버리지

전체 테스트 커버리지 확인:
```bash
cd ..
npm test -- --coverage
```

## 🔄 업데이트 이력

- 2025-12-01: 스크립트 폴더 구조 생성 및 정리
