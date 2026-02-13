# API Documentation - Sztylc & Sons

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require authentication via NextAuth.js session cookie.

### Login
```http
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Logout
```http
GET /api/auth/signout
```

## API Endpoints

### Quote Requests

#### Create Quote Request (CLIENT only)
```http
POST /api/quotes
Content-Type: application/json
Authorization: Required

{
  "title": "Kitchen Renovation",
  "description": "Complete kitchen renovation including cabinets and countertops",
  "location": "123 Main St, London",
  "contactInfo": "+44 20 1234 5678"
}

Response: 201 Created
{
  "id": "clx...",
  "clientId": "clx...",
  "title": "Kitchen Renovation",
  "description": "Complete kitchen renovation...",
  "location": "123 Main St, London",
  "contactInfo": "+44 20 1234 5678",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### List Quote Requests (CLIENT, MANAGER)
```http
GET /api/quotes
Authorization: Required

Response: 200 OK
[
  {
    "id": "clx...",
    "title": "Kitchen Renovation",
    "description": "...",
    "status": "pending",
    "client": {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "jobs": [
      {
        "id": "clx...",
        "title": "Kitchen Job",
        "status": "SCHEDULED"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Jobs

#### Create Job (MANAGER only)
```http
POST /api/jobs
Content-Type: application/json
Authorization: Required (MANAGER)

{
  "quoteRequestId": "clx...",  // Optional
  "title": "Kitchen Renovation - 123 Main St",
  "description": "Complete kitchen renovation project",
  "location": "123 Main St, London",
  "status": "SCHEDULED",
  "startDate": "2024-02-01",
  "endDate": "2024-02-15",
  "estimatedHours": 80
}

Response: 201 Created
{
  "id": "clx...",
  "managerId": "clx...",
  "title": "Kitchen Renovation - 123 Main St",
  "description": "Complete kitchen renovation project",
  "location": "123 Main St, London",
  "status": "SCHEDULED",
  "startDate": "2024-02-01T00:00:00.000Z",
  "endDate": "2024-02-15T00:00:00.000Z",
  "estimatedHours": 80,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### List Jobs (MANAGER, WORKER)
```http
GET /api/jobs
Authorization: Required

Response: 200 OK
[
  {
    "id": "clx...",
    "title": "Kitchen Renovation",
    "description": "...",
    "location": "123 Main St, London",
    "status": "SCHEDULED",
    "estimatedHours": 80,
    "manager": {
      "id": "clx...",
      "name": "Manager Name",
      "email": "manager@example.com"
    },
    "assignments": [
      {
        "id": "clx...",
        "worker": {
          "id": "clx...",
          "name": "Worker Name",
          "email": "worker@example.com"
        }
      }
    ]
  }
]
```

### Assignments

#### Create Assignment (MANAGER only)
```http
POST /api/assignments
Content-Type: application/json
Authorization: Required (MANAGER)

{
  "jobId": "clx...",
  "workerId": "clx...",
  "weekStart": "2024-02-05",  // Monday of the week
  "notes": "Main carpenter for cabinets"
}

Response: 201 Created
{
  "id": "clx...",
  "jobId": "clx...",
  "workerId": "clx...",
  "weekStart": "2024-02-05T00:00:00.000Z",
  "weekEnd": "2024-02-11T23:59:59.999Z",
  "notes": "Main carpenter for cabinets",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### List Assignments (MANAGER, WORKER)
```http
GET /api/assignments
Authorization: Required

# Workers only see their own assignments
# Managers see all assignments

Response: 200 OK
[
  {
    "id": "clx...",
    "weekStart": "2024-02-05T00:00:00.000Z",
    "weekEnd": "2024-02-11T23:59:59.999Z",
    "notes": "Main carpenter for cabinets",
    "job": {
      "id": "clx...",
      "title": "Kitchen Renovation",
      "location": "123 Main St, London",
      "status": "SCHEDULED"
    },
    "worker": {
      "id": "clx...",
      "name": "Worker Name",
      "email": "worker@example.com"
    },
    "shifts": [
      {
        "id": "clx...",
        "date": "2024-02-05T00:00:00.000Z",
        "hoursWorked": 8,
        "status": "SUBMITTED"
      }
    ]
  }
]
```

### Shift Submissions

#### Submit Shift (WORKER only)
```http
POST /api/shifts
Content-Type: application/json
Authorization: Required (WORKER)

{
  "assignmentId": "clx...",
  "date": "2024-02-05",
  "hoursWorked": 8.5,
  "photoUrls": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "notes": "Completed cabinet installation"
}

Response: 201 Created
{
  "id": "clx...",
  "assignmentId": "clx...",
  "workerId": "clx...",
  "date": "2024-02-05T00:00:00.000Z",
  "hoursWorked": 8.5,
  "photoUrls": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
  "notes": "Completed cabinet installation",
  "status": "SUBMITTED",
  "approvedById": null,
  "approvedAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### List Shifts (MANAGER, WORKER)
```http
GET /api/shifts
Authorization: Required

# Workers only see their own shifts
# Managers see all shifts

Response: 200 OK
[
  {
    "id": "clx...",
    "date": "2024-02-05T00:00:00.000Z",
    "hoursWorked": 8.5,
    "photoUrls": ["https://example.com/photo1.jpg"],
    "notes": "Completed cabinet installation",
    "status": "SUBMITTED",
    "assignment": {
      "id": "clx...",
      "job": {
        "id": "clx...",
        "title": "Kitchen Renovation",
        "location": "123 Main St, London"
      }
    },
    "worker": {
      "id": "clx...",
      "name": "Worker Name",
      "email": "worker@example.com"
    },
    "approvedBy": null,
    "approvedAt": null
  }
]
```

#### Approve/Reject Shift (MANAGER only)
```http
PATCH /api/shifts/:id
Content-Type: application/json
Authorization: Required (MANAGER)

{
  "status": "APPROVED"  // or "REJECTED"
}

Response: 200 OK
{
  "id": "clx...",
  "status": "APPROVED",
  "approvedById": "clx...",
  "approvedAt": "2024-01-02T00:00:00.000Z",
  ...
}

Note: When status is "APPROVED", a Payroll entry is automatically created
```

### Payroll

#### List Payroll (MANAGER, WORKER)
```http
GET /api/payroll?weekStart=2024-02-05&workerId=clx...
Authorization: Required

# Workers only see their own payroll
# Managers can filter by worker or see all

Query Parameters:
- weekStart (optional): Filter by week start date (ISO 8601)
- workerId (optional, MANAGER only): Filter by worker ID

Response: 200 OK
[
  {
    "id": "clx...",
    "shiftId": "clx...",
    "workerId": "clx...",
    "weekStart": "2024-02-05T00:00:00.000Z",
    "weekEnd": "2024-02-11T23:59:59.999Z",
    "hoursWorked": 8.5,
    "fullDayRate": 120.00,
    "totalAmount": 127.50,  // (8 / 8 * 120) + (0.5 / 8 * 120)
    "calculatedAt": "2024-01-02T00:00:00.000Z",
    "paidAt": null,
    "worker": {
      "id": "clx...",
      "name": "Worker Name",
      "email": "worker@example.com"
    },
    "shift": {
      "id": "clx...",
      "date": "2024-02-05T00:00:00.000Z",
      "assignment": {
        "id": "clx...",
        "job": {
          "title": "Kitchen Renovation"
        }
      }
    }
  }
]
```

## Payroll Calculation

The payroll calculation follows this formula:

```
FULL_DAY_HOURS = 8 (configured in .env)
FULL_DAY_RATE = £120 (configured in .env)
HOURLY_RATE = FULL_DAY_RATE / FULL_DAY_HOURS = £15/hour

For hoursWorked = 8.5:
- Full Days = floor(8.5 / 8) = 1
- Remaining Hours = 8.5 % 8 = 0.5
- Total Amount = (1 * £120) + (0.5 * £15) = £127.50
```

## Error Responses

### 400 Bad Request
```json
{
  "error": [
    {
      "path": ["field"],
      "message": "Validation error message"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

**Recommended for Production:**
- 100 requests per minute per IP address
- 10 login attempts per hour per IP address
- Implement using middleware or API gateway

## Webhooks (Future Enhancement)

For real-time notifications, consider implementing webhooks for:
- New quote requests
- Shift submissions
- Shift approvals
- Payroll calculations

## Best Practices

1. **Always use HTTPS** in production
2. **Include error handling** in all API calls
3. **Validate responses** before using data
4. **Handle rate limits** gracefully
5. **Store sensitive data** securely
6. **Use environment variables** for API configuration

## Example Client Code

### JavaScript/TypeScript

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return response.json()
}

// Create Quote Request
const createQuote = async (data: QuoteData) => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Include cookies
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Submit Shift
const submitShift = async (shiftData: ShiftData) => {
  const response = await fetch('/api/shifts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(shiftData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit shift')
  }
  
  return response.json()
}
```

## Changelog

### v1.0 (Initial Release)
- Quote request management
- Job creation and assignment
- Shift submission with photo URLs
- Manager approval workflow
- Payroll calculation

---

For questions or support, please contact the development team.
