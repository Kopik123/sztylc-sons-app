# Sztylc & Son’s – Specyfikacja (MVP) – Web/PWA + Android/iOS (PWA)

## Region
- Lancashire (UK) – stronę publiczną optymalizujemy pod miasta: Preston, Blackburn, Burnley, Lancaster, Chorley, Blackpool, Accrington, Leyland, Darwen itd.

## Pozycjonowanie
- Premium / precyzja / czystość wykonania
- Udowadnianie jakości: zdjęcia postępu + dziennik pracy + akceptacje

## Role
- **Client** – prośba o wycenę, akceptacja, podgląd postępu (zdjęcia), historia
- **Worker** – widzi przypisane joby, wpisuje shift, dodaje zdjęcia i notatki
- **Manager/Admin** – tworzy joby, planuje tydzień (calendar), zatwierdza shifty, rozlicza tygodniowo

## Zasady rozliczeń (ważne)
- **8h = Full Day Rate**
- Shifty są zatwierdzane przez managera:
  - pending → approved / rejected
- Weekly payroll liczy tylko **approved** shifty.
- Płatność (propozycja):
  - full_days = floor(total_hours / 8)
  - partial_hours = total_hours - full_days*8
  - pay = full_days*day_rate + (partial_hours/8)*day_rate
  - (opcjonalnie) zaokrąglenia: do 0.25h lub do pełnych 0.5h

## Statusy
- Quote: new → sent → accepted/rejected
- Job: planned → in_progress → review → complete
- Shift: pending → approved/rejected

## MVP – funkcje obowiązkowe
### Public
- Home + Services + Gallery + Areas Covered + Contact + Request Quote

### Panel Worker
- My Jobs
- My Week (calendar/my-week)
- Submit Shift (godziny + notatka)
- Upload Photos (po jobie lub po shifcie)

### Panel Manager
- Dashboard: pending shifts, today’s jobs
- Weekly Calendar: planowanie tygodnia + przypisania
- Shift approvals: approve/reject
- Weekly payroll summary + export CSV

## Technologie (rekomendacja)
- Frontend: React (Vite) + Tailwind + PWA
- Backend: Laravel + Sanctum (token)
- DB: MySQL
- Storage: local public → później S3/Wasabi
