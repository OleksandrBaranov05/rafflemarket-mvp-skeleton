# RaffleMarket MVP Skeleton (Next.js 15 + TS + CSS Modules)

Це заготовка структури під MVP з:
- App Router (Next.js 15)
- Auth через httpOnly session cookie (HMAC-signed payload)
- Guard приватних маршрутів через server helper `requireSession()` + `redirect()`
- React Query provider (TanStack)
- Formik + Yup (login форма)
- Toasts (react-hot-toast)
- Global `app/error.tsx` та `app/not-found.tsx`

## Як підключити
1) Створи новий Next.js проект (`npx create-next-app@latest`) з App Router + TypeScript.
2) Скопіюй вміст цієї папки поверх свого проекту (з мерджем директорій).
3) Встанови залежності:
   - @tanstack/react-query
   - formik
   - yup
   - react-hot-toast

4) (Опціонально) Задай SESSION_SECRET в .env.local

## Демо логіни
- **Продавець**: demo@demo.com / password
- **Адмін**: admin@admin.com / admin

## Структура проєкту

### Ключові функції MVP:
- ✅ Публічний каталог лотів (`/raffles`) з пошуком, фільтрацією та сортуванням
- ✅ Детальна сторінка лоту з купівлею квитків (`/raffles/[id]`)
- ✅ Відображення моїх квитків на сторінці лоту
- ✅ Кабінет продавця (`/dashboard`) - створення та перегляд своїх лотів
- ✅ Статистика продавця (дохід, продажі, комісії)
- ✅ Історія покупок користувача (`/dashboard/tickets`) - мої квитки
- ✅ Адмін-панель модерації (`/admin`) - затвердження/відхилення лотів
- ✅ Автоматичний випадковий вибір переможця при продажу всіх квитків
- ✅ Escrow-статуси (pending → funded → disbursed)

### Технології:
- Next.js 15 (App Router)
- TypeScript
- CSS Modules
- React Query (TanStack Query)
- Formik + Yup
- react-hot-toast
- In-memory database (для MVP, замінити на реальну БД)
