# App-GPT

## Описание

App-GPT - современное веб-приложение для общения с языковой моделью GPT. Фронтенд развернут на Vercel, бэкенд - на Render.

---

## Содержание

- Описание
- Возможности
- Структура проекта
- Быстрый старт
- Установка и запуск
- Переменные окружения
- Деплой
- Технологии
- Контакты

---

## Возможности

- Общение с AI через удобный веб-интерфейс
- Быстрый отклик и современный дизайн
- Простая интеграция и настройка
---

## Структура проекта
```
app-gpt/
├── server/ # Серверная часть (API)
├── client/ # Клиентская часть (React.js)
└── README.md
```
---

## Быстрый старт

1. Клонируйте репозиторий:
    ```
    git clone https://github.com/MolokovNikita/app-gpt.git
    cd app-gpt
    ```
2. Запустите бэкенд:
    ```
    cd server
    npm install
    npm run start
    ```
3. Запустите фронтенд:
    ```
    cd ../client
    npm install
    npm run dev
    ```
4. Откройте [http://localhost:5173](http://localhost:5173) в браузере.

---

## Установка и запуск

### Backend

- Требования: Node.js, npm
- Установка зависимостей: `npm install`
- Запуск: `npm run dev`

### Frontend

- Требования: Node.js, npm
- Установка зависимостей: `npm install`
- Запуск: `npm run dev`

---

## Переменные окружения

### Backend (`backend/.env`)

- `PORT=3001`
- `OPENAI_API_KEY=your_openai_api_key`

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL=https://<backend-render-url>`

---

## Деплой

### Backend на Render

- Создайте новый Web Service, укажите папку `server`
- Добавьте переменные окружения
- Укажите Build Command: `npm install`
- Укажите Start Command: `npm run start`

### Frontend на Vercel

- Импортируйте проект, выберите папку `client`
- Укажите переменные окружения
- Деплой происходит автоматически

---

## Технологии

- Next.js, React, TypeScript (Frontend)
- Node.js, Express (Backend)
- OpenAI API
- Render, Vercel

---

## Контакты
Автор: [MolokovNikita](https://github.com/MolokovNikita/app-gpt)
---
> Для корректной работы настройте переменные окружения и убедитесь, что сервисы доступны по актуальным адресам.
