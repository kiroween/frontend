# TimeGrave Frontend Documentation

이 폴더에는 TimeGrave 프론트엔드 개발 과정에서 생성된 문서들이 정리되어 있습니다.

## 📁 폴더 구조

### `/tasks` - 작업 요약 문서
개발 작업(Task)별 구현 내용과 결과를 정리한 문서들입니다.

- `TASK_*_SUMMARY.md` - 각 작업의 구현 요약
- `CHECKPOINT_*.md` - 체크포인트 상태 확인 문서

**주요 문서:**
- `TASK_10_SUMMARY.md` - 환경 변수 설정
- `TASK_10.1_ENV_TESTS_SUMMARY.md` - 환경 변수 테스트
- `TASK_15_IMPLEMENTATION_SUMMARY.md` - 타임캡슐 상세 페이지 연동
- `CHECKPOINT_16_STATUS.md` - 테스트 상태 검증

### `/guides` - 가이드 및 체크리스트
개발자를 위한 사용 가이드, 검증 방법, 체크리스트 문서들입니다.

- `*_GUIDE.md` - 사용 가이드
- `*_CHECKLIST.md` - 체크리스트
- `*_VERIFICATION.md` - 검증 방법
- `verify-*.md` - 검증 가이드
- `PROPERTY_*.md` - Property 테스트 관련
- `PERFORMANCE_*.md` - 성능 관련
- `OPTIMIZATION_*.md` - 최적화 관련

**주요 문서:**
- `INTEGRATION_TEST_GUIDE.md` - 통합 테스트 가이드
- `INTEGRATION_TEST_CHECKLIST.md` - 통합 테스트 체크리스트
- `ENV_SETUP_VERIFICATION.md` - 환경 설정 검증
- `verify-env-tests.md` - 환경 변수 테스트 검증

### `/implementation` - 구현 상세 문서
각 기능의 구현 방법과 기술적 세부사항을 설명하는 문서들입니다.

- `*_IMPLEMENTATION.md` - 구현 상세 설명
- `*_SUMMARY.md` - 구현 요약
- `*_INTEGRATION.md` - 통합 관련

**주요 문서:**
- `API_CLIENT_IMPLEMENTATION.md` - API 클라이언트 구현
- `UNAUTHORIZED_HANDLING_IMPLEMENTATION.md` - 401 처리 구현
- `LOGIN_INTEGRATION_SUMMARY.md` - 로그인 통합
- `SIGNUP_INTEGRATION_SUMMARY.md` - 회원가입 통합

### `/testing` - 테스트 문서
테스트 전략, 테스트 결과, 테스트 가이드 문서들입니다.

**주요 문서:**
- `TASK_17_INTEGRATION_TESTING.md` - 통합 테스트 구현

## 📚 문서 사용 가이드

### 새로운 기능 개발 시
1. `/tasks` 폴더에서 관련 작업 문서 확인
2. `/implementation` 폴더에서 구현 방법 참고
3. `/guides` 폴더에서 체크리스트 활용

### 테스트 실행 시
1. `/testing` 폴더에서 테스트 가이드 확인
2. `/guides` 폴더에서 검증 방법 참고
3. `/scripts` 폴더의 `run-*` 스크립트 사용

### 문제 해결 시
1. `/guides` 폴더에서 관련 가이드 검색
2. `/implementation` 폴더에서 구현 세부사항 확인
3. `/tasks` 폴더에서 작업 히스토리 확인

## 🔗 관련 파일

### 루트 폴더의 주요 파일
- `README.md` - 프로젝트 전체 README
- `.env.local` - 환경 변수 설정
- `package.json` - 프로젝트 설정 및 의존성

### 스크립트 폴더
- `/scripts` - 테스트 실행 및 검증 스크립트
  - `run-*.bat`, `run-*.ps1` - 테스트 실행 스크립트
  - `verify-*.ps1`, `verify-*.js` - 검증 스크립트
  - 자세한 내용은 `/scripts/README.md` 참고

### 소스 코드
- `/src` - 실제 소스 코드
- `/src/**/__tests__` - 테스트 코드

## 📝 문서 작성 규칙

### 파일명 규칙
- `TASK_[번호]_[제목].md` - 작업 문서
- `[기능]_IMPLEMENTATION.md` - 구현 문서
- `[기능]_GUIDE.md` - 가이드 문서
- `[기능]_CHECKLIST.md` - 체크리스트
- `CHECKPOINT_[번호]_[제목].md` - 체크포인트 문서

### 문서 구조
각 문서는 다음 섹션을 포함해야 합니다:
- **Overview/Summary** - 개요
- **Requirements** - 요구사항
- **Implementation Details** - 구현 세부사항
- **Testing** - 테스트 방법
- **Status** - 상태 (완료/진행중/대기)

## 🗂️ 문서 정리

### 문서 이동 스크립트
루트 폴더의 임시 문서들을 정리하려면:

```powershell
# PowerShell에서 실행
.\organize-docs.ps1
```

이 스크립트는:
- 임시 문서들을 적절한 폴더로 복사
- 원본 파일은 유지 (검토 후 삭제 가능)
- 폴더 구조 자동 생성

### 정리 후 확인사항
1. docs 폴더의 문서들이 올바르게 복사되었는지 확인
2. 원본 파일들을 검토
3. 문제없으면 원본 파일 삭제:
   ```powershell
   # 주의: 검토 후 실행!
   Remove-Item TASK_*.md
   Remove-Item *_SUMMARY.md
   Remove-Item *_IMPLEMENTATION.md
   # ... 등등
   ```

## 📌 참고사항

- 이 문서들은 개발 과정의 기록이며, 코드와 함께 버전 관리됩니다
- 문서는 정기적으로 업데이트되어야 합니다
- 오래된 문서는 `archive/` 폴더로 이동할 수 있습니다
- 중요한 문서는 프로젝트 README에 링크를 추가하세요

## 🔄 업데이트 이력

- 2025-12-01: 초기 문서 구조 생성 및 정리
