@echo off
chcp 65001 >nul
echo ========================================
echo   Capital Clicker - GitHub 배포
echo ========================================
echo.

echo [1/3] 변경사항 추가 중...
git add .

echo [2/3] 커밋 생성 중...
set timestamp=%date% %time%
git commit -m "Auto update: %timestamp%"

if errorlevel 1 (
    echo.
    echo ⚠ 변경사항이 없습니다.
    echo.
    pause
    exit /b 0
)

echo [3/3] GitHub에 푸시 중...
git push

if errorlevel 1 (
    echo.
    echo ❌ 푸시 실패! 원격 저장소 설정을 확인하세요.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 배포 완료!
echo GitHub Pages에서 몇 분 후 업데이트됩니다.
echo.
pause

