# IT Today Web Frontend Architecture

This document describes the high-level architecture and technology stack for the `ittod-web-frontend` project.

## Overview
The frontend provides the user interface for landing pages, event discovery, dashboard management, and competition submissions. It operates as a decoupled Single Page Application (SPA) consuming the `ittod-web-api`.

## Technology Stack
- **Framework**: React 19 built with Vite.
- **Routing**: React Router DOM (v6/v7) for client-side routing and protected routes.
- **Styling**: Tailwind CSS (v4) with custom utility classes. 
- **State & Data Fetching**: Axios for API requests, combined with React hooks (`useState`, `useEffect`) for localized state.
- **Icons**: React Icons and Remixicon.

## Project Structure
- `src/api/`: Axios instances and wrapper functions for all backend API calls (e.g., `user.js`, `eventPublic.js`, `compeFile.js`).
- `src/components/`: Reusable UI components (Navbar, Footers, Modals) and Dashboard sub-components (e.g., `CompRegisCard.jsx`, `EventRegisCard.jsx`).
- `src/pages/`: Top-level route components (Landing Page, Dashboard, Registration Forms, Dynamic Submission Pages).
- `src/hooks/`: Custom React hooks (e.g., `useRegisStatus.js` for dynamic registration tracking).
- `src/assets/` & `public/`: Static assets including event and competition logos.

## Data Flow & Integrations

1. **User Authentication**:
   - The UI communicates with the backend for login/registration and OAuth flows.
   - Authentication tokens or secure cookies verify session status for protected routes (like the Dashboard).
2. **Dynamic Event Data**:
   - The frontend heavily relies on dynamic API fetching (e.g., `GET /api/events`) to ascertain which events/competitions are currently active (`is_active` flag) and if they require submissions (`requires_submission` flag).
   - This ensures the UI accurately mirrors the configuration set dynamically via the database instead of local hardcoded config files.
   - Competition registration routes resolve an event ID or normalized title to the event returned by the API, ensuring the form heading displays the competition name instead of a UUID.
   - Registration forms use `participation_type`: `team` requires a team name, while `individual` allows direct registration without that field.
   - Competition detail pages apply the same rule: individual registration asks for confirmation and submits directly, while team registration opens the team-name form.
   - The dashboard hides internal team names and join codes for individual competitions and labels the registered member as `Peserta`.
   - Direct individual registration requires explicit user confirmation before the API request is sent, preventing accidental enrollment.
   - The participant `Daftar Event` and `Daftar Lomba` routes use a shared responsive neobrutalist dashboard shell. Their event/competition cards keep API calls, individual registration confirmation, team registration, and join-code behavior separate from visual styling.
   - Team creation (`/register-competition/:competitionSlug`) reuses the same neobrutalist dashboard header, active sidebar state, and shared footer while preserving competition lookup, validation, registration payload, alerts, and redirects.
   - The existing Join Team toggle renders a dedicated neobrutalist main panel while preserving the same local state, `joinTeam(teamId)` request, loading state, cancel behavior, and success redirect.
   - Event registration (`/daftar-event/:target`) reuses the same neobrutalist dashboard shell and shared footer for loading, form, and success states while retaining its existing event checks, validation, registration/upload requests, WhatsApp actions, and redirects.
   - All pages reuse `Footer.jsx` as the single Contact Us and navigation footer. The dashboard selects its neobrutalist variant while preserving the same event, competition, social-media, email, and WhatsApp destinations.
3. **File Uploads & Submissions**:
   - Users upload payment proofs and competition deliverables via the UI.
   - The frontend bundles files as `FormData` and sends them via Axios to the backend, which securely validates and stores them in Cloudflare R2 Storage (and subsequently the MySQL database).
