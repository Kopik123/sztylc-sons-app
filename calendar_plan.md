# Calendar (Grafik) – Plan MVP

## Cel
- Manager planuje tydzień (Mon–Sun) i przypisuje workerów do jobów na konkretne dni.
- Worker widzi własny tydzień.

## Źródło prawdy
- `job_assignments` (job_id, worker_user_id, assigned_date)

## UI (MVP)
- Manager:
  - tygodniowa tabela 7 kolumn (dni)
  - szybkie przypisanie: job + worker + date
- Worker:
  - własna tabela 7 kolumn (dni) + lista jobów

## Ulepszenia
- Endpoint `GET /api/users?role=worker` do pełnej listy workerów
- Drag&drop
- Widok miesięczny
