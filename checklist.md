# Checklist – Budowa systemu (MVP)

## Projekt / Repo
- [ ] Utwórz repo: `sztylc-sons`
- [ ] Struktura: `backend/`, `frontend/`, `docs/`, `exports/`

## Backend (Laravel)
- [ ] Laravel + Sanctum skonfigurowane
- [ ] Migracje: users(role,phone), workers(day_rate), jobs, job_assignments, shifts, photos
- [ ] Seed: manager + 2 workers + client + demo job
- [ ] API: auth/login, auth/logout, me
- [ ] API: jobs index + create + assign
- [ ] API: shifts submit + pending + approve/reject
- [ ] API: payroll/weekly
- [ ] API: calendar/week + calendar/my-week

## Frontend (React/PWA)
- [ ] Login
- [ ] Worker: Shift form
- [ ] Worker: My Week
- [ ] Manager: Pending shifts
- [ ] Manager: Calendar (weekly)
- [ ] PWA manifest + icons
- [ ] API baseURL env (dev/prod)

## Storage / Upload
- [ ] Upload zdjęć + zapis do DB
- [ ] Ograniczenia: max rozmiar, typy, kompresja po stronie klienta (później)

## Produkcja
- [ ] Domena + SSL
- [ ] Nginx (site + api subdomain)
- [ ] Backup DB (cron)
- [ ] Logi + monitoring
