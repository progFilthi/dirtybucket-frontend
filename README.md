# Beat Marketplace Frontend

Modern beat marketplace frontend built with Next.js App Router, TypeScript, and shadcn/ui. This application integrates with a Spring Boot backend and supports role-based authentication for producers and artists.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Bun + bunx
- Tailwind CSS
- shadcn/ui
- TanStack Query (server state)
- Zod (schema validation)

---

## Authentication & Authorization

The application implements a complete authentication flow integrated with a Spring Boot + Spring Security backend.

### Features

- JWT-based authentication
- Role-based access control (PRODUCER, ARTIST)
- Secure token storage and refresh handling
- Protected routes and layouts
- Role-aware dashboards

### Auth Flow

1. User signs up or logs in
2. Backend issues JWT access token
3. Frontend stores token securely
4. Auth context provides user + role state
5. Route guards enforce role-based access
6. Automatic redirect on auth/role mismatch

---

## Role-Based Dashboards

The UI supports multiple roles per user with separate experiences:

### Producer

- Beat creation and management
- Direct-to-S3 asset uploads (presigned URLs)
- Pricing and publishing
- Sales and performance metrics

Routes:
- `/producer/dashboard`
- `/producer/beats`
- `/producer/beats/new`

### Artist

- Marketplace browsing
- Beat preview and purchase
- Purchased beat library

Routes:
- `/marketplace`
- `/beats/[beatId]`
- `/library`

---

## File Upload Architecture

All media uploads use direct-to-S3 presigned URLs for scalability.

### Upload Flow

1. Frontend requests presigned URL from backend
2. Backend creates asset record and returns presigned URL
3. Frontend uploads file directly to S3
4. Frontend notifies backend on completion
5. Backend triggers async processing

This design avoids routing large files through the API and supports background media processing.

---

## Development

Run the development server:

```bash
bun dev
app/
  producer/
  marketplace/
  artist/
lib/
  api/
  auth/
  hooks/
components/

