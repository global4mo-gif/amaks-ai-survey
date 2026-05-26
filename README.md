# Опросник AMAKS для семинара по ИИ

Простая локальная страница для сбора анкет сотрудников. Ответы сохраняются в `data/responses.jsonl` и автоматически собираются в Excel-файл `data/responses.xlsx`.

## Запуск

```bash
python3 server.py
```

Откройте страницу:

```text
http://127.0.0.1:8000
```

Excel можно скачать по адресу:

```text
http://127.0.0.1:8000/download
```

## Онлайн-сбор

GitHub Pages не умеет записывать ответы в файл сам по себе. Для общего онлайн-сбора используйте Google Sheets + Apps Script по инструкции в `ONLINE_COLLECTION.md`.

Для запуска на другом порту:

```bash
PORT=8080 python3 server.py
```
