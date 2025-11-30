# 프로젝트 정리 가이드

이 가이드는 frontend 폴더의 임시 문서와 스크립트 파일들을 정리하는 방법을 설명합니다.

## 📋 현재 상황

frontend 루트 폴더에 다음과 같은 파일들이 산재해 있습니다:

### 📄 문서 파일 (약 20개)
```
TASK_*.md
*_SUMMARY.md
*_IMPLEMENTATION.md
*_INTEGRATION.md
*_GUIDE.md
*_CHECKLIST.md
CHECKPOINT_*.md
verify-*.md
PROPERTY_*.md
PERFORMANCE_*.md
OPTIMIZATION_*.md
```

### 🔧 스크립트 파일 (약 25개)
```
run-*.bat
run-*.ps1
run-*.js
verify-*.ps1
verify-*.js
test-*.js
install-and-test.bat
```

## 🎯 정리 목표

```
frontend/
├── docs/                    # 📄 모든 문서
│   ├── tasks/              # 작업 요약
│   ├── guides/             # 가이드
│   ├── implementation/     # 구현 상세
│   └── testing/            # 테스트 문서
├── scripts/                # 🔧 모든 스크립트
│   ├── run-*.bat
│   ├── run-*.ps1
│   └── verify-*.ps1
└── src/                    # 💻 소스 코드만
```

## 🚀 정리 방법

### 방법 1: 자동 정리 스크립트 (추천)

```powershell
cd frontend
.\organize-docs.ps1
```

이 스크립트가 자동으로:
- ✅ 문서 파일들을 `docs/` 폴더로 분류 및 복사
- ✅ 스크립트 파일들을 `scripts/` 폴더로 복사
- ✅ 원본 파일은 유지 (안전)
- ✅ 정리 결과 요약 출력

### 방법 2: 수동 정리

#### 1단계: 문서 정리
```powershell
# 작업 문서
Move-Item TASK_*.md docs/tasks/
Move-Item CHECKPOINT_*.md docs/tasks/

# 구현 문서
Move-Item *_SUMMARY.md docs/implementation/
Move-Item *_IMPLEMENTATION.md docs/implementation/
Move-Item *_INTEGRATION.md docs/implementation/

# 가이드
Move-Item *_GUIDE.md docs/guides/
Move-Item *_CHECKLIST.md docs/guides/
Move-Item *_VERIFICATION.md docs/guides/
Move-Item verify-*.md docs/guides/
Move-Item PROPERTY_*.md docs/guides/
Move-Item PERFORMANCE_*.md docs/guides/
Move-Item OPTIMIZATION_*.md docs/guides/

# 테스트 문서
Move-Item TASK_17_INTEGRATION_TESTING.md docs/testing/
```

#### 2단계: 스크립트 정리
```powershell
# 모든 스크립트 파일
Move-Item run-*.bat scripts/
Move-Item run-*.ps1 scripts/
Move-Item run-*.js scripts/
Move-Item verify-*.ps1 scripts/
Move-Item verify-*.js scripts/
Move-Item test-*.js scripts/
Move-Item install-and-test.bat scripts/

# organize-docs.ps1은 제외 (루트에 유지)
```

## ✅ 정리 후 확인

### 1. 폴더 구조 확인
```powershell
# 문서 확인
ls docs -Recurse | Select-Object FullName

# 스크립트 확인
ls scripts | Select-Object Name
```

### 2. 스크립트 동작 확인
```powershell
cd scripts
.\run-env-test.ps1  # 예시: 환경 변수 테스트
```

### 3. 원본 파일 확인
```powershell
# 루트에 남아있는 문서/스크립트 파일 확인
ls *.md | Where-Object { $_.Name -notmatch "^(README|CLEANUP_GUIDE)" }
ls *.bat, *.ps1, *.js | Where-Object { $_.Name -ne "organize-docs.ps1" }
```

## 🗑️ 원본 파일 삭제

정리된 파일들이 정상 동작하는 것을 확인한 후:

```powershell
# ⚠️ 주의: 복구 불가능! 반드시 확인 후 실행

# 문서 파일 삭제
Remove-Item TASK_*.md
Remove-Item *_SUMMARY.md
Remove-Item *_IMPLEMENTATION.md
Remove-Item *_INTEGRATION.md
Remove-Item *_GUIDE.md
Remove-Item *_CHECKLIST.md
Remove-Item CHECKPOINT_*.md
Remove-Item verify-env-tests.md
Remove-Item PROPERTY_*.md
Remove-Item PERFORMANCE_*.md
Remove-Item OPTIMIZATION_*.md
Remove-Item ENV_SETUP_VERIFICATION.md

# 스크립트 파일 삭제
Remove-Item run-*.bat
Remove-Item run-*.ps1
Remove-Item run-*.js
Remove-Item verify-*.ps1
Remove-Item verify-*.js
Remove-Item test-*.js
Remove-Item install-and-test.bat
```

또는 한 번에:
```powershell
# 안전한 방법: 먼저 확인
$filesToDelete = @(
    "TASK_*.md", "*_SUMMARY.md", "*_IMPLEMENTATION.md",
    "*_INTEGRATION.md", "*_GUIDE.md", "*_CHECKLIST.md",
    "CHECKPOINT_*.md", "verify-env-tests.md", "PROPERTY_*.md",
    "PERFORMANCE_*.md", "OPTIMIZATION_*.md", "ENV_SETUP_VERIFICATION.md",
    "run-*.bat", "run-*.ps1", "run-*.js",
    "verify-*.ps1", "verify-*.js", "test-*.js",
    "install-and-test.bat"
)

# 삭제할 파일 목록 확인
foreach ($pattern in $filesToDelete) {
    Get-ChildItem -Path "." -Filter $pattern -File | Select-Object Name
}

# 확인 후 삭제
foreach ($pattern in $filesToDelete) {
    Remove-Item $pattern -ErrorAction SilentlyContinue
}
```

## 📦 Git 커밋

### 옵션 A: 한 번에 커밋
```bash
git add docs/ scripts/
git add organize-docs.ps1 CLEANUP_GUIDE.md
git commit -m "chore: Organize documentation and scripts into folders

- Move all documentation to docs/ folder
  - docs/tasks/ - Task summaries
  - docs/guides/ - Guides and checklists
  - docs/implementation/ - Implementation details
  - docs/testing/ - Testing documentation
- Move all scripts to scripts/ folder
  - Test runners (run-*.bat, run-*.ps1)
  - Verification scripts (verify-*.ps1)
- Add README files for both folders
- Add organization script and cleanup guide"
```

### 옵션 B: 단계별 커밋

```bash
# 1. 문서 정리
git add docs/
git commit -m "docs: Organize documentation into structured folders"

# 2. 스크립트 정리
git add scripts/
git commit -m "chore: Move scripts to scripts/ folder"

# 3. 도구 추가
git add organize-docs.ps1 CLEANUP_GUIDE.md
git commit -m "chore: Add organization tools and cleanup guide"

# 4. 원본 파일 삭제 (정리 후)
git rm TASK_*.md *_SUMMARY.md run-*.bat run-*.ps1
git commit -m "chore: Remove original files after organization"
```

## 📊 정리 전후 비교

### 정리 전
```
frontend/
├── TASK_10_SUMMARY.md
├── TASK_15_IMPLEMENTATION_SUMMARY.md
├── API_CLIENT_IMPLEMENTATION.md
├── run-api-test.bat
├── run-auth-test.bat
├── verify-backend.ps1
├── ... (45개 이상의 파일)
└── src/
```

### 정리 후
```
frontend/
├── docs/
│   ├── README.md
│   ├── tasks/ (10개 파일)
│   ├── guides/ (15개 파일)
│   ├── implementation/ (10개 파일)
│   └── testing/ (5개 파일)
├── scripts/
│   ├── README.md
│   └── (25개 스크립트)
├── src/
├── organize-docs.ps1
└── CLEANUP_GUIDE.md
```

## 🎉 완료 체크리스트

- [ ] `organize-docs.ps1` 실행
- [ ] `docs/` 폴더 내용 확인
- [ ] `scripts/` 폴더 내용 확인
- [ ] 스크립트 동작 테스트
- [ ] 원본 파일 삭제
- [ ] Git 커밋
- [ ] 팀원들에게 변경사항 공유

## 💡 추가 팁

### .gitignore 업데이트
정리 후 루트에 임시 파일이 생기지 않도록:

```gitignore
# Temporary documentation (add to .gitignore)
TASK_*.md
*_SUMMARY.md
*_IMPLEMENTATION.md
CHECKPOINT_*.md

# Temporary scripts
run-test-*.bat
run-test-*.ps1
```

### 문서 참조 업데이트
다른 문서에서 파일 경로를 참조하는 경우 업데이트:
- `run-test.bat` → `scripts/run-test.bat`
- `TASK_10_SUMMARY.md` → `docs/tasks/TASK_10_SUMMARY.md`

### README 업데이트
프로젝트 README에 새 폴더 구조 설명 추가

## 🆘 문제 해결

### 스크립트가 동작하지 않음
- 경로 확인: 스크립트는 `scripts/` 폴더에서 실행
- 스크립트 내부에서 `cd ..` 또는 `Set-Location $PSScriptRoot\..` 확인

### 파일을 찾을 수 없음
- `docs/` 또는 `scripts/` 폴더에서 검색
- `ls -Recurse -Filter "파일명"` 사용

### Git 충돌
- 정리 전 커밋: `git add . && git commit -m "Before cleanup"`
- 문제 발생 시 롤백: `git reset --hard HEAD^`

## 📞 도움이 필요하면

- `docs/README.md` - 문서 폴더 가이드
- `scripts/README.md` - 스크립트 폴더 가이드
- 프로젝트 README - 전체 프로젝트 구조

---

**마지막 업데이트**: 2025-12-01
