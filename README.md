# Event Management System

This is an event management platform built with Next.js, TypeScript, Prisma, PostgreSQL, and NextAuth.

The application supports three roles:

- Admin
- Organizer
- User

Users can browse events, register for free or paid events, upload payment proof, and view tickets. Organizers can create and manage their own events and verify registrations. Admins can manage users and categories.

## Features

- Role-based access for admin, organizer, and user
- Event creation and management
- Category management
- Event registration for free and paid events
- Payment screenshot upload and verification
- Ticket issuance after verification
- User profile and ticket pages

## Tech Stack

- Next.js
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Tailwind CSS
- shadcn/ui
- Axios

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository.

```bash
git clone https://github.com/Manish-s1/event_management_system.git
cd event_management_system
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/eventdb"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migration and generate Prisma client.

```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server.

```bash
npm run dev
```

6. Open `http://localhost:3000` in your browser.

## Default Test Credentials

- Admin: `admin@gmail.com` / `admin123`

## Main Routes

- `/` home page
- `/events` public events listing
- `/events/[id]` event details
- `/categories` category listing
- `/auth/login` login page
- `/auth/signup` signup page
- `/admin/*` admin dashboard and management
- `/organizer/*` organizer dashboard and event management
- `/user/*` user profile, registrations, and tickets

## API Summary

### Public

- `GET /api/events`
- `GET /api/events/[id]`
- `GET /api/events/recent`
- `GET /api/categories`

### User

- `POST /api/events/[id]/register`
- `GET /api/user/registrations`
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/user/profile`

### Organizer

- `GET /api/organizer/events`
- `POST /api/organizer/events`
- `GET /api/organizer/events/[eventId]`
- `PUT /api/organizer/events/[eventId]`
- `DELETE /api/organizer/events/[eventId]`
- `PUT /api/organizer/events/[eventId]/registrations/[regId]`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/[id]`
- `DELETE /api/admin/users/[id]`
- `POST /api/admin/category`
- `PUT /api/admin/category/[id]`
- `DELETE /api/admin/category/[id]`

## Project Structure

```text
app/           application routes, pages, and API handlers
components/    shared UI and feature components
context/       React context providers
hooks/         custom hooks
lib/           utility and configuration files
prisma/        Prisma schema and database files
public/        static files and uploads
src/generated/ generated Prisma client files
types/         shared type definitions
```

## Roles

### Admin

- Manage users
- Manage categories
- View events and dashboard data

### Organizer

- Create and manage own events
- View registrations for own events
- Verify payments
- Issue tickets

### User

- Browse events
- Register for events
- Upload payment proof for paid events
- View profile, registrations, and tickets

## Development Commands

```bash
npx prisma migrate dev --name change_name
npx prisma migrate reset
npx prisma generate
npx prisma studio
npm run build
npm start
```

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Push the branch.
5. Open a pull request.

## License

MIT
