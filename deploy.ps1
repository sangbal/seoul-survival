# Capital Clicker - GitHub 자동 배포 스크립트

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Capital Clicker - GitHub 배포" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] 변경사항 추가 중..." -ForegroundColor Yellow
git add .

Write-Host "[2/3] 커밋 생성 중..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto update: $timestamp"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠ 변경사항이 없습니다." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 0
}

Write-Host "[3/3] GitHub에 푸시 중..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 푸시 실패! 원격 저장소 설정을 확인하세요." -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "✅ 배포 완료!" -ForegroundColor Green
Write-Host "GitHub Pages에서 몇 분 후 업데이트됩니다." -ForegroundColor Green
Write-Host ""
pause

