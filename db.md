# DB schema (MVP) – MySQL

## users
- id (PK)
- name
- email (unique)
- password
- role: client|worker|manager
- phone (nullable)
- timestamps

## workers
- id (PK)
- user_id (FK users.id)
- day_rate (decimal)
- is_active (bool)
- timestamps

## quotes (opcjonalnie w MVP, ale zalecane)
- id
- client_user_id (FK users.id)
- address_id (FK addresses.id, nullable)
- service (enum/string)
- description (text)
- preferred_date (date, nullable)
- status: new|sent|accepted|rejected
- price (decimal, nullable)
- manager_notes (text, nullable)
- timestamps

## jobs
- id
- quote_id (nullable)
- client_user_id (FK users.id)
- address_id (nullable)
- title
- status: planned|in_progress|review|complete
- start_date (nullable)
- end_date (nullable)
- timestamps

## job_assignments  (grafik / calendar)
- id
- job_id (FK jobs.id)
- worker_user_id (FK users.id)
- assigned_date (date)
- unique(job_id, worker_user_id, assigned_date)
- timestamps

## shifts
- id
- job_id (FK jobs.id)
- worker_user_id (FK users.id)
- shift_date (date)
- start_time (nullable)
- end_time (nullable)
- hours (decimal)
- notes (text, nullable)
- status: pending|approved|rejected
- approved_by (FK users.id, nullable)
- approved_at (timestamp, nullable)
- unique(job_id, worker_user_id, shift_date)
- timestamps

## photos
- id
- job_id (FK jobs.id)
- shift_id (FK shifts.id, nullable)
- uploaded_by (FK users.id)
- path (string)
- caption (nullable)
- timestamps
