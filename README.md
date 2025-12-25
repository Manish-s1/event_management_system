# 🎉 Event Management System

A comprehensive event management platform built with **Next.js 16**, featuring role-based access control, event registration, payment verification, and ticket issuance system.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth.js-Authentication-black)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#️-database-schema)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Workflows](#-workflows)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎫 Event Management
- **Create & Manage Events** - Organizers can create paid/free events with customizable details
- **Event Categories** - Organize events by categories for easy browsing
- **Slot Management** - Track available slots and prevent overbooking
- **Search & Filter** - Advanced filtering by category, price, date, and keywords

### 👥 Multi-Role System
- **Admin Dashboard** - Manage users, categories, and view all events
- **Organizer Portal** - Create events, manage registrations, verify payments
- **User Portal** - Browse events, register, view tickets and profile

### 💳 Payment Integration
- **Paid Events Support** - Organizers can set prices and upload payment QR codes
- **Payment Verification** - Users upload payment screenshots for organizer verification
- **Ticket Issuance** - Automated ticket generation after payment verification

### 🎟️ Registration System
- **Easy Registration** - Simple registration flow for both free and paid events
- **Registration Management** - Track all user registrations and tickets
- **Verification Workflow** - Multi-step verification process for paid events

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (JWT Strategy)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **HTTP Client:** Axios

---

## 🗄️ Database Schema

### **User**
```prisma
- id: UUID (Primary Key)
- username: String
- email: String (Unique)
- password: String (Hashed with bcrypt)
- role: Enum (ADMIN | ORGANIZER | USER)
- isVerified: Boolean
```

### **Event**
```prisma
- id: UUID (Primary Key)
- title: String
- description: String
- date: DateTime
- location: String
- organizerId: Foreign Key → User
- categoryId: Foreign Key → Category
- isPaid: Boolean
- price: Float (Optional)
- paymentQR: String (Optional, Base64)
- totalSlots: Int
- availableSlots: Int
- createdAt: DateTime
```

### **Category**
```prisma
- id: UUID (Primary Key)
- name: String (Unique)
- isActive: Boolean
- createdAt: DateTime
```

### **Registration**
```prisma
- id: UUID (Primary Key)
- userId: Foreign Key → User
- eventId: Foreign Key → Event
- fullName: String
- email: String
- phone: String
- address: String
- paymentScreenshot: String (Optional, Base64)
- isVerified: Boolean
- ticketIssued: Boolean
- createdAt: DateTime
- Unique: (userId, eventId)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manish-s1/event_management_system.git
   cd event_management_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/eventdb"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Test Credentials
- **Admin:** manish123@gmail.com / manish123@gmail.com
- Create additional organizers and users via the admin panel

---

## 📁 Project Structure

```
event_management_system/
├── app/
│   ├── admin/              # Admin dashboard & management
│   ├── organizer/          # Organizer portal & event management
│   ├── user/               # User profile & tickets
│   ├── events/             # Public event browsing
│   ├── categories/         # Category browsing
│   ├── auth/               # Authentication pages
│   └── api/                # API routes
│       ├── admin/          # Admin endpoints
│       ├── organizer/      # Organizer endpoints
│       ├── user/           # User endpoints
│       ├── events/         # Public event endpoints
│       └── auth/           # Authentication endpoints
├── components/
│   ├── components/         # Shared components (Header, Footer)
│   ├── ui/                 # shadcn/ui components
│   └── user/               # User-specific components
├── context/                # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & configs
├── prisma/                 # Database schema & migrations
└── types/                  # TypeScript type definitions
```

---

## 📡 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | List/filter events |
| `GET` | `/api/events/[id]` | Get event details |
| `GET` | `/api/events/recent` | Recent events for home page |
| `GET` | `/api/categories` | List all categories |

### User Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/events/[id]/register` | Register for an event |
| `GET` | `/api/user/registrations` | Get user's registrations |
| `GET` | `/api/user/profile` | Get user profile |
| `PUT` | `/api/user/profile` | Update profile |
| `POST` | `/api/user/profile` | Change password |

### Organizer Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/organizer/events` | List organizer's events |
| `POST` | `/api/organizer/events` | Create new event |
| `GET` | `/api/organizer/events/[eventId]` | Get event with registrations |
| `PUT` | `/api/organizer/events/[eventId]` | Update event |
| `DELETE` | `/api/organizer/events/[eventId]` | Delete event |
| `PUT` | `/api/organizer/events/[eventId]/registrations/[regId]` | Verify/issue ticket |

### Admin Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard` | Admin dashboard stats |
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/users` | Create user |
| `PUT/DELETE` | `/api/admin/users/[id]` | Manage users |
| `POST` | `/api/admin/category` | Create category |
| `PUT/DELETE` | `/api/admin/category/[id]` | Manage categories |

---

## 👤 User Roles

### 🛡️ Admin
**Accessible Routes:** `/admin/*`

**Permissions:**
- ✅ View, create, edit, and delete users
- ✅ Manage categories (add/edit/delete)
- ✅ View all events (read-only)
- ❌ Cannot edit/delete events created by organizers

### 📊 Organizer
**Accessible Routes:** `/organizer/*`

**Permissions:**
- ✅ Create events (paid/free, set price, upload payment QR)
- ✅ View only their own events
- ✅ View registrations for their events
- ✅ Verify payment screenshots
- ✅ Issue tickets after verification
- ❌ Cannot access admin panel or other organizers' events

### 🎫 User
**Accessible Routes:** `/user/*`, public pages

**Permissions:**
- ✅ Browse and search events
- ✅ Register for events
- ✅ Submit payment screenshots (for paid events)
- ✅ View their registrations and tickets
- ✅ Edit profile and change password
- ❌ Cannot access admin or organizer dashboards

---

## 🔄 Workflows

### User Registration Flow
```
1. Browse events → 2. Click event details
3. Click "Register" (login required)
4. Fill registration form
5. Upload payment screenshot (if paid event)
6. Submit registration
7. Wait for organizer verification
8. Receive ticket → View in /user/tickets
```

### Organizer Event Management Flow
```
1. Login → Organizer Dashboard
2. Create Event → Set details, price, upload QR
3. View registrations for event
4. Review payment screenshots
5. Verify payment → Mark as verified
6. Issue ticket to user
7. User receives ticket notification
```

### Admin Management Flow
```
1. Login → Admin Dashboard
2. Manage Users → Create/Edit/Delete users
3. Manage Categories → Add/Edit/Delete categories
4. View all events and statistics
5. Monitor system activity
```

---

## 🎨 Key Features Explained

### Payment Verification System
- **For Paid Events:** Organizers upload a payment QR code when creating events
- **User Payment:** Users scan QR, make payment, and upload screenshot during registration
- **Verification:** Organizers review screenshots and verify authenticity
- **Ticket Issuance:** Only after verification can tickets be issued

### Event Filtering
Users can filter events by:
- 🔍 **Search:** Keyword search across titles and descriptions
- 📂 **Category:** Filter by event categories
- 💰 **Price:** Filter by price range (min/max)
- 💳 **Payment Type:** Show paid or free events only
- 📅 **Sort:** By upcoming date, newest, or oldest

### Slot Management
- `totalSlots`: Maximum event capacity
- `availableSlots`: Automatically decremented on registration
- Events show "Sold Out" when `availableSlots = 0`
- Prevents overbooking

---

## 🔒 Security Features

- **Password Hashing:** All passwords encrypted with bcrypt
- **JWT Authentication:** Secure session management with NextAuth.js
- **Role-based Access Control:** Middleware protection for all protected routes
- **Password Change Verification:** Requires old password to set new password
- **SQL Injection Prevention:** Prisma ORM with parameterized queries

---

## 🧪 Development

### Database Commands
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | Secret key for JWT encryption | Random string (min 32 chars) |
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

**Project Maintainer:** Manish-s1

**Repository:** [https://github.com/Manish-s1/event_management_system](https://github.com/Manish-s1/event_management_system)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components

---

<div align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong>
</div>
