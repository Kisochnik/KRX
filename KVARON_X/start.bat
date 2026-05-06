@echo off
cd /d "%~dp0"

echo Запуск KRX...

:: Проверка Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Python не установлен! Скачай с python.org
    pause
    exit
)

:: Установка зависимостей при первом запуске
if not exist ".deps_installed" (
    echo Установка зависимостей...
    pip install flask flask-sqlalchemy werkzeug mutagen >nul 2>&1
    echo. > .deps_installed
)

:: Создание БД если нет
if not exist "instance\krx.db" (
    echo Создание базы данных...
    python -c "from app import app, db; app.app_context().push(); db.create_all()"
)

:: Запуск сервера
start "" http://127.0.0.1:5000
python app.py

pause