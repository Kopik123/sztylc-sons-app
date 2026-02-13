# Sztylc & Sons - Job Management System

A production-grade TypeScript application for managing jobs, workers, and payroll for Sztylc & Sons (UK).

## Features

- **Role-based Access Control**: Three user roles (Client, Worker, Manager)
- **Authentication**: Secure login with NextAuth.js
- **Quote Requests**: Clients can request quotes for jobs
- **Job Management**: Managers can create and assign jobs
- **Weekly Calendar**: Assign workers to jobs on a weekly basis
- **Shift Submissions**: Workers submit shifts with photos
- **Manager Approval**: Managers approve/reject shift submissions
- **Payroll Calculation**: Automatic payroll calculation (8 hours = full day rate)
- **PostgreSQL Database**: Using Prisma ORM
- **Docker Support**: Full Docker Compose setup

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Validation**: Zod
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 20+ or Docker
- PostgreSQL (if running locally without Docker)

## Getting Started

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd sztylc-sons-app
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start with Docker Compose:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec app npm run db:migrate
```

5. Seed the database:
```bash
docker-compose exec app npm run db:seed
```

6. Access the application at `http://localhost:3000`

### Option 2: Local Development

1. Install dependencies:
```bash
npm install
```

2. Setup environment:
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

3. Start PostgreSQL (if not using Docker):
```bash
# Make sure PostgreSQL is running on port 5432
```

4. Run migrations:
```bash
npm run db:migrate
```

5. Seed the database:
```bash
npm run db:seed
```

6. Start development server:
```bash
npm run dev
```

7. Access the application at `http://localhost:3000`

## Test Credentials

After seeding, you can login with these credentials:

- **Manager**: `manager@sztylc.com` / `manager123`
- **Worker 1**: `worker1@sztylc.com` / `worker123`
- **Worker 2**: `worker2@sztylc.com` / `worker123`
- **Client**: `client@example.com` / `client123`

## Database Schema

The application uses the following main models:

- **User**: Users with roles (CLIENT, WORKER, MANAGER)
- **QuoteRequest**: Quote requests from clients
- **Job**: Jobs created by managers
- **Assignment**: Weekly worker assignments to jobs
- **ShiftSubmission**: Shift submissions from workers with photos
- **Payroll**: Calculated payroll entries

## API Routes

- `POST /api/quotes` - Create quote request (Client)
- `GET /api/quotes` - List quote requests
- `POST /api/jobs` - Create job (Manager)
- `GET /api/jobs` - List jobs
- `POST /api/assignments` - Create assignment (Manager)
- `GET /api/assignments` - List assignments
- `POST /api/shifts` - Submit shift (Worker)
- `GET /api/shifts` - List shifts
- `PATCH /api/shifts/:id` - Approve/Reject shift (Manager)
- `GET /api/payroll` - View payroll

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio
```

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- Role-based access control on all routes
- Input validation with Zod
- SQL injection protection via Prisma
- CSRF protection via NextAuth
- Environment variable protection

## Production Deployment

1. Set strong `NEXTAUTH_SECRET` in production
2. Update `DATABASE_URL` to production PostgreSQL instance
3. Set `NODE_ENV=production`
4. Build and deploy using Docker Compose or your preferred platform

### Docker Production Build

```bash
docker-compose -f docker-compose.yml up -d
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   └── page.tsx           # Home page (redirects by role)
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── session.ts        # Session helpers
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seed script
├── types/                # TypeScript type definitions
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker build configuration
└── .env.example          # Environment variables template
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software for Sztylc & Sons (UK).

## Support

For issues or questions, please contact the development team.
