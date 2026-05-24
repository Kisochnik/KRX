# KVARON_X (KRX)

Премиальная социальная сеть — чёрно-белый glassmorphism UI, масштабируемая архитектура.

## Стек

- React 19 · Next.js 16 (App Router) · Tailwind CSS 4
- Framer Motion · Lucide React

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Архитектура

```
src/
├── app/              # Next.js маршруты (тонкий слой)
├── views/            # Композиции страниц (= pages layer)
├── layouts/          # AppShell, Sidebar, RightPanel, MobileNav
├── components/       # Feature-компоненты (feed, messages, …)
├── ui/               # Переиспользуемые UI-примитивы
├── hooks/            # React hooks
├── animations/       # Framer Motion variants & wrappers
├── settings/         # Конфиг, тема, SettingsProvider
├── language/         # i18n (ru/en), LanguageProvider
├── lib/              # Типы, data, repositories, utils
├── config/           # Навигация и статический конфиг
└── providers/        # Корневые провайдеры
```

> **Примечание:** папка `views/` — это слой страниц. Next.js резервирует `src/pages/` для Pages Router, поэтому используется `views/`.

### Слои (Clean Architecture)

| Слой | Папка | Назначение |
|------|-------|------------|
| Presentation | `views`, `components`, `layouts`, `ui` | UI |
| Application | `hooks`, `providers` | Логика приложения |
| Domain | `lib/types` | Сущности |
| Infrastructure | `lib/data`, `lib/repositories` | Данные (mock → API) |

### i18n

```tsx
import { useLanguage } from "@/hooks";

const { t, locale, setLocale } = useLanguage();
t.nav.feed; // "Лента"
```

Локали: `src/language/locales/ru.ts`, `en.ts`

### Настройки

```tsx
import { useSettings } from "@/hooks";

const { animationsEnabled, sidebarCollapsed, toggleSidebar } = useSettings();
```

### Анимации

```tsx
import { FadeIn, staggerContainer } from "@/animations";
import { useMotionConfig } from "@/hooks";
```

Уважает `prefers-reduced-motion` и флаг `animationsEnabled`.

## Адаптивность

| Breakpoint | Поведение |
|------------|-----------|
| mobile | Нижняя навигация, скрытая правая панель |
| tablet (md+) | Sidebar |
| desktop (lg+) | Полный layout |
| wide (xl+) | Правая панель трендов |

## Маршруты

| URL | View |
|-----|------|
| `/` | Лента |
| `/explore` | Обзор |
| `/messages` | Сообщения |
| `/notifications` | Уведомления |
| `/profile` | Профиль |

© 2026 KVARON_X · KRX
