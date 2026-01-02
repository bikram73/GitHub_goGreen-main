@echo off
echo 🔧 Git Configuration for GitHub Profile
echo ========================================
echo.
echo 📧 First, you need your GitHub email address.
echo.
echo 📋 Steps to find your GitHub email:
echo 1. Go to: https://github.com/settings/emails
echo 2. Copy your primary email address
echo 3. Come back here
echo.
echo ⚠️  IMPORTANT: Use the EXACT email from your GitHub account!
echo.
set /p email="📧 Enter your GitHub email: "

if "%email%"=="" (
    echo ❌ No email entered. Please try again.
    pause
    exit /b
)

echo.
echo ⚙️  Configuring git...
echo.

git config --global user.email "%email%"
git config --global user.name "bikram73"

echo ✅ Git configuration complete!
echo.
echo 📋 Configuration set:
echo    Email: %email%
echo    Name: bikram73
echo.
echo 🎉 SUCCESS! Git is now configured with your GitHub account.
echo.
echo 🚀 NEXT STEPS:
echo 1. Run: node create-2024-commits.js
echo 2. Wait 5-10 minutes  
echo 3. Check: https://github.com/bikram73/
echo.
echo 🌱 Your GitHub profile will now show green squares!
echo.
pause