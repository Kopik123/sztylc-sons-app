# API (MVP) – endpoints

## Auth
- POST `/api/auth/login` {email,password,device_name} -> {token,user}
- POST `/api/auth/logout` (Bearer token)
- GET `/api/me` (Bearer token)

## Jobs
- GET `/api/jobs` (role-based)
- POST `/api/jobs` (manager) {client_user_id,title,status?,start_date?,end_date?}
- POST `/api/jobs/{job}/assign` (manager) {worker_user_id,assigned_date}

## Calendar
- GET `/api/calendar/week?from=YYYY-MM-DD` (manager) -> week range + items
- GET `/api/calendar/my-week?from=YYYY-MM-DD` (worker) -> week range + items

## Shifts
- POST `/api/jobs/{job}/shifts` (worker) {shift_date,hours OR start_time+end_time,notes?}
- GET `/api/shifts/pending` (manager)
- POST `/api/shifts/{shift}/approve` (manager)
- POST `/api/shifts/{shift}/reject` (manager) {reason?}

## Payroll
- GET `/api/payroll/weekly?from=YYYY-MM-DD&to=YYYY-MM-DD` (manager)

## Photos (następny moduł)
- POST `/api/jobs/{job}/photos` (worker) multipart/form-data: file + caption? + shift_id?
- GET `/api/jobs/{job}/photos` (client/manager/worker, role based)
