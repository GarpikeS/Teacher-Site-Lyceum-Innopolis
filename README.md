# 🎓 Code Learning Platform

Образовательная платформа для изучения Python и C++ для 7 класса (углубленный уровень).

## 📋 Описание

Веб-платформа с интерактивными уроками, онлайн редактором кода и автоматической проверкой заданий:

- **40 уроков**: 20 по Python + 20 по C++
- **Онлайн редактор**: Monaco Editor с выполнением кода в изолированном Docker окружении
- **3 роли**: Ученики, Учителя, Администраторы
- **Система прогресса**: Отслеживание прогресса, достижения, статистика
- **PWA**: Работа офлайн, push-уведомления

## 🏗️ Архитектура

```
┌──────────────────┐
│  Next.js (Vercel)│  Frontend
└────────┬─────────┘
         │ REST API
┌────────┴─────────────────────────┐
│  Express API (Railway)           │  Backend
└──┬─────────────┬─────────────────┘
   │             │
   ▼             ▼
┌──────────┐  ┌────────────────────┐
│PostgreSQL│  │ Code Executor Svc  │
│  +Redis  │  │ Docker Sandbox     │
└──────────┘  └────────────────────┘
```

## 🛠️ Технологический стек

**Frontend:**
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Monaco Editor, shadcn/ui, Zustand, TanStack Query

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL, Redis, Bull Queue

**Code Execution:**
- Docker Sandbox (Python 3.11, GCC 12)
- Ограничения: 5s timeout, 128MB RAM

**Deployment:**
- Vercel (frontend), Railway (backend + DB + executor)
- Бюджет: ~$20/мес

## 📁 Структура проекта

```
code-learning-platform/
├── apps/
│   ├── web/                    # Next.js Frontend
│   ├── api/                    # Express Backend API
│   └── code-executor/          # Code Execution Service
├── packages/
│   └── shared-types/          # Общие TypeScript типы
└── infrastructure/
    └── docker/                # Docker configs
```

## 🚀 Быстрый старт

### Требования

- Node.js >= 18
- npm >= 9
- Docker Desktop

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/yourusername/code-learning-platform.git
cd code-learning-platform

# 2. Установить зависимости
npm install

# 3. Запустить Docker services (PostgreSQL + Redis)
npm run docker:up

# 4. Настроить environment variables
cp .env.example .env
# Отредактировать .env файл

# 5. Применить миграции БД
cd apps/api
npm run db:migrate

# 6. Запустить dev серверы
cd ../..
npm run dev
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Code Executor: http://localhost:3002

### Docker команды

```bash
# Запустить все сервисы
npm run docker:up

# Остановить сервисы
npm run docker:down

# Просмотр логов
npm run docker:logs

# Перезапустить сервисы
npm run docker:down && npm run docker:up
```

## 📚 Разработка

### Доступные команды

```bash
npm run dev          # Запустить dev серверы для всех apps
npm run build        # Собрать все приложения
npm run start        # Запустить production серверы
npm run lint         # Проверить код линтером
npm run test         # Запустить тесты
npm run format       # Форматировать код (Prettier)
npm run clean        # Очистить build artifacts
```

### Работа с пакетами

```bash
# Добавить зависимость в конкретный пакет
cd apps/web
npm install package-name

# Добавить dev зависимость в корень
npm install -D package-name -w root

# Добавить зависимость во все пакеты
npm install package-name --workspaces
```

## 🗄️ База данных

### Схема

14 таблиц:
- users, courses, lessons, assignments
- submissions, user_progress, course_enrollments
- achievements, user_achievements, notifications
- classes, class_students, refresh_tokens, audit_logs

### Миграции

```bash
cd apps/api

# Создать новую миграцию
npm run db:migrate:create migration-name

# Применить миграции
npm run db:migrate

# Откатить миграцию
npm run db:migrate:rollback

# Seed данные
npm run db:seed
```

## 🔐 Аутентификация

**JWT Strategy:**
- Access token: 15 минут
- Refresh token: 7 дней

**Роли (RBAC):**
- Student: Просмотр уроков, выполнение заданий
- Teacher: + Проверка работ, статистика класса
- Admin: Полный доступ

## 🐳 Docker Sandbox

Безопасное выполнение Python и C++ кода:

**Ограничения:**
- Timeout: 5-10 секунд
- Memory: 128-256MB
- CPU: 50% одного ядра
- Network: Отключена
- Root FS: Read-only

**Запрещенные паттерны:**
- Python: `import os`, `eval()`, `exec()`, `open()`
- C++: `#include <fstream>`, `system()`, `popen()`

## 📊 API Endpoints

**Base URL:** `http://localhost:3001/api/v1`

**Auth:** `/auth/register`, `/auth/login`, `/auth/refresh`
**Courses:** `/courses`, `/courses/:id`, `/courses/:id/enroll`
**Lessons:** `/courses/:courseId/lessons`, `/lessons/:id/complete`
**Assignments:** `/lessons/:lessonId/assignments`
**Submissions:** `/assignments/:id/submit`, `/submissions/:id/review`
**Code Execution:** `/code/execute`, `/code/validate`
**Progress:** `/progress/me`, `/progress/courses/:courseId`

Полная документация API: [docs/API.md](docs/API.md)

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Деплой

### Frontend (Vercel)

```bash
# Установить Vercel CLI
npm install -g vercel

# Деплой
cd apps/web
vercel --prod
```

### Backend (Railway)

```bash
# Установить Railway CLI
npm install -g @railway/cli

# Логин
railway login

# Деплой
cd apps/api
railway up
```

Подробнее: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 📖 Документация

- [Architecture](docs/ARCHITECTURE.md) - Архитектура системы
- [API Reference](docs/API.md) - Документация API
- [Database Schema](docs/DATABASE_SCHEMA.md) - Схема БД
- [Deployment Guide](docs/DEPLOYMENT.md) - Инструкции по деплою
- [Contributing](docs/CONTRIBUTING.md) - Руководство для контрибьюторов

## 🤝 Вклад в проект

Мы приветствуем вклад в проект! Пожалуйста, прочитайте [CONTRIBUTING.md](docs/CONTRIBUTING.md) перед началом работы.

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл

## 👥 Авторы

- Your Name - Initial work

## 🙏 Благодарности

- Monaco Editor
- shadcn/ui
- Docker
- Railway, Vercel

---

Сделано с ❤️ для учеников 7 класса
