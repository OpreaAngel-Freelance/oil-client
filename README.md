# Oil Management System

A modern Next.js 15 application for managing oil resources with Keycloak authentication and role-based access control.

## Features

- 🔐 **Keycloak Authentication** - Secure authentication with automatic token refresh
- 👥 **Role-Based Access Control** - ROLE_USER can view, ROLE_ADMIN can create/edit/delete
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 🔄 **Real-time Updates** - React Query for efficient data fetching and caching
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🚀 **Next.js 15** - Latest features including App Router and Server Components

## Prerequisites

- Node.js 18+ 
- Keycloak server
- Backend API running at http://localhost:8080

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file with:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=oil-client
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/your-realm

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── api/auth/            # NextAuth API routes
│   ├── auth/                # Authentication pages
│   └── page.tsx             # Main dashboard
├── components/              
│   ├── ui/                  # Reusable UI components
│   ├── oil/                 # Oil-specific components
│   └── providers.tsx        # App providers
├── lib/                     
│   └── api-client.ts        # API client with auth
├── types/                   
│   └── oil.ts               # TypeScript types
├── auth.ts                  # NextAuth configuration
└── middleware.ts            # Auth middleware
```

## Usage

1. Users are automatically redirected to Keycloak for authentication
2. After login, users can view oil resources
3. Admins can create, edit, and delete oil resources
4. The app handles token refresh automatically

## API Endpoints

The app connects to these backend endpoints:
- `GET /api/v1/oil/` - List oil resources (ROLE_USER)
- `POST /api/v1/oil/` - Create oil resource (ROLE_ADMIN)
- `PUT /api/v1/oil/{id}` - Update oil resource (ROLE_ADMIN)
- `DELETE /api/v1/oil/{id}` - Delete oil resource (ROLE_ADMIN)
- `POST /api/v1/oil/upload-url` - Generate upload URL (ROLE_ADMIN)