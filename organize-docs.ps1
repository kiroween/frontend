# Script to organize documentation and script files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TimeGrave Project Organization Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create folder structure
Write-Host "Creating folder structure..." -ForegroundColor Green
$folders = @(
    "docs/tasks",
    "docs/guides",
    "docs/implementation",
    "docs/testing",
    "scripts"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host "  ✓ Created: $folder" -ForegroundColor Cyan
    } else {
        Write-Host "  ✓ Exists: $folder" -ForegroundColor Gray
    }
}
Write-Host ""

# Move TASK_* files to docs/tasks
$taskFiles = Get-ChildItem -Path "." -Filter "TASK_*.md" -File
foreach ($file in $taskFiles) {
    $dest = "docs/tasks/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "Copied: $($file.Name) -> docs/tasks/" -ForegroundColor Yellow
}

# Move CHECKPOINT_* files to docs/tasks
$checkpointFiles = Get-ChildItem -Path "." -Filter "CHECKPOINT_*.md" -File
foreach ($file in $checkpointFiles) {
    $dest = "docs/tasks/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "Copied: $($file.Name) -> docs/tasks/" -ForegroundColor Yellow
}

# Move *_SUMMARY.md files to docs/implementation
$summaryFiles = Get-ChildItem -Path "." -Filter "*_SUMMARY.md" -File
foreach ($file in $summaryFiles) {
    $dest = "docs/implementation/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "Copied: $($file.Name) -> docs/implementation/" -ForegroundColor Yellow
}

# Move *_IMPLEMENTATION.md files to docs/implementation
$implFiles = Get-ChildItem -Path "." -Filter "*_IMPLEMENTATION.md" -File
foreach ($file in $implFiles) {
    $dest = "docs/implementation/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "Copied: $($file.Name) -> docs/implementation/" -ForegroundColor Yellow
}

# Move *_INTEGRATION.md files to docs/implementation
$integrationFiles = Get-ChildItem -Path "." -Filter "*_INTEGRATION.md" -File
foreach ($file in $integrationFiles) {
    $dest = "docs/implementation/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "Copied: $($file.Name) -> docs/implementation/" -ForegroundColor Yellow
}

# Move guide files to docs/guides
$guidePatterns = @(
    "*_GUIDE.md",
    "*_CHECKLIST.md",
    "*_VERIFICATION.md",
    "verify-*.md",
    "PROPERTY_*.md",
    "PERFORMANCE_*.md",
    "OPTIMIZATION_*.md"
)

foreach ($pattern in $guidePatterns) {
    $guideFiles = Get-ChildItem -Path "." -Filter $pattern -File
    foreach ($file in $guideFiles) {
        $dest = "docs/guides/$($file.Name)"
        Copy-Item $file.FullName $dest -Force
        Write-Host "Copied: $($file.Name) -> docs/guides/" -ForegroundColor Yellow
    }
}

# Move testing documentation to docs/testing
$testingFiles = @(
    "TASK_17_INTEGRATION_TESTING.md"
)

foreach ($fileName in $testingFiles) {
    if (Test-Path $fileName) {
        $dest = "docs/testing/$fileName"
        Copy-Item $fileName $dest -Force
        Write-Host "Copied: $fileName -> docs/testing/" -ForegroundColor Yellow
    }
}

# Move script files to scripts folder
Write-Host "Moving script files..." -ForegroundColor Green

# Move run-* scripts
$runScripts = Get-ChildItem -Path "." -Filter "run-*.bat" -File
$runScripts += Get-ChildItem -Path "." -Filter "run-*.ps1" -File
$runScripts += Get-ChildItem -Path "." -Filter "run-*.js" -File

foreach ($file in $runScripts) {
    # Skip the organize-docs.ps1 script itself
    if ($file.Name -ne "organize-docs.ps1") {
        $dest = "scripts/$($file.Name)"
        Copy-Item $file.FullName $dest -Force
        Write-Host "  Copied: $($file.Name) -> scripts/" -ForegroundColor Yellow
    }
}

# Move verify-* scripts
$verifyScripts = Get-ChildItem -Path "." -Filter "verify-*.ps1" -File
$verifyScripts += Get-ChildItem -Path "." -Filter "verify-*.js" -File

foreach ($file in $verifyScripts) {
    $dest = "scripts/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "  Copied: $($file.Name) -> scripts/" -ForegroundColor Yellow
}

# Move test-* scripts
$testScripts = Get-ChildItem -Path "." -Filter "test-*.js" -File

foreach ($file in $testScripts) {
    $dest = "scripts/$($file.Name)"
    Copy-Item $file.FullName $dest -Force
    Write-Host "  Copied: $($file.Name) -> scripts/" -ForegroundColor Yellow
}

# Move install-and-test.bat
if (Test-Path "install-and-test.bat") {
    Copy-Item "install-and-test.bat" "scripts/install-and-test.bat" -Force
    Write-Host "  Copied: install-and-test.bat -> scripts/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Organization Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Folder structure:" -ForegroundColor Cyan
Write-Host "  docs/tasks/          - Task summaries and checkpoints" -ForegroundColor White
Write-Host "  docs/guides/         - User guides and checklists" -ForegroundColor White
Write-Host "  docs/implementation/ - Implementation details" -ForegroundColor White
Write-Host "  docs/testing/        - Testing documentation" -ForegroundColor White
Write-Host "  scripts/             - Test runners and utility scripts" -ForegroundColor White
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
$docCount = (Get-ChildItem -Path "docs" -Recurse -File).Count
$scriptCount = (Get-ChildItem -Path "scripts" -File).Count
Write-Host "  📄 Documentation files: $docCount" -ForegroundColor White
Write-Host "  🔧 Script files: $scriptCount" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Original files are preserved." -ForegroundColor Yellow
Write-Host "   Review the organized files, then delete originals if satisfied." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review organized files: ls docs, ls scripts" -ForegroundColor White
Write-Host "  2. Test scripts still work from new location" -ForegroundColor White
Write-Host "  3. Delete original files if satisfied" -ForegroundColor White
Write-Host "  4. Update any references in documentation" -ForegroundColor White
Write-Host "  5. Commit changes: git add docs/ scripts/" -ForegroundColor White
Write-Host ""
