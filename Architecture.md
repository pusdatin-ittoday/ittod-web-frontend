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

### Public Neo-Brutalist Experience
- `/` and `/home` compose the public Home sections with a shared fixed `Navbar`, dynamic event and competition sections, contact callout, and dynamic `Footer`.
- The Home intro uses a responsive Neo-Brutalist editorial block with a split-color heading, hard-shadow description panel, and four color-coded statistic cards sourced from the existing landing statistics data.
- The Home hero is rendered with code-native responsive SVG wave bands and heavy responsive blue-outlined display typography, preserving sharp Neo-Brutalist visuals without depending on an additional raster hero asset.
- The API-backed Home competition grid uses responsive Neo-Brutalist poster cards with motion feedback; card links retain the existing competition-detail routes, while their CTA changes from indigo to UX-inspired olive on hover.
- Competition cards render poster media exclusively from the Admin-provided `logo_url`; missing or failed media exposes the browser's broken-image indicator and accessible competition title instead of hardcoded local artwork.
- The API-backed Main Event grid renders logos exclusively from the Admin-provided `logo_url`; missing or failed media exposes the browser's broken-image indicator and accessible event title instead of hardcoded local artwork. Event routes and fetching remain unchanged, while CTA hover transitions from yellow to Workshop-inspired indigo.
- Event and competition detail, dashboard registration, submission, and legacy API-backed cards also consume only the Admin-provided `logo_url`; local event/competition artwork is never used as a fallback.
- The Home timeline presents the existing event and competition timeline datasets inside one responsive Neo-Brutalist panel, with a circular year badge and connected color-coded milestones.
- The Home partner section renders the seven official sponsor assets already stored under `public/sponsors`; the former `Partner 1–6` placeholders and “updated soon” copy are no longer used.
- `/event/:slug` and `/competition/:slug` retain their existing API-backed detail lookup while sharing the same thick-border, hard-shadow visual system.
- The API-backed event detail route uses an event-specific Neo-Brutalist hero with enlarged logo placement above the title, responsive about and information panels, and an animated compact contact card; its existing slug lookup, state, registration destination, and event fields remain unchanged.
- Both full and compact Get in Touch cards use layered hard-shadow translation and hover motion, with the compact event-detail variant presenting the dedicated Contact Us composition.
- Public `Contact Us` navigation scrolls to `#contact` on the Home page. The `Kontak Kami` call-to-action opens the official WhatsApp contact directly; there is no separate contact page.
- All public and authenticated pages resolve to one shared footer implementation. Its desktop layout uses five horizontal columns, event and competition links are populated from the existing API, and all six official social-media links are displayed.
- The footer competition section displays horizontally in a 3-column grid layout (using `grid-cols-3`), with each competition name shown inline rather than stacked vertically.
- The public navbar displays only the logo (no text) on the left side, with navigation links and auth buttons on the right. Mobile menu includes a styled LOGOUT button with red background (`bg-red-600`) matching the PROFILE button styling.
- The public navbar reads `AuthContext`, which hydrates from the existing backend authentication-status endpoint and refreshes current-user data when an Express session remains active. Unauthenticated visitors see the yellow `LOGIN` action, while authenticated visitors see the green `PROFILE` action linked to `/dashboard/beranda`.
- Dashboard header (`DashboardNeoHeader`) uses the same visual style as the landing navbar (indigo background, thick black border, yellow hover effects) with a prominent LOGOUT button in red, ensuring visual consistency across authenticated and public pages. On mobile and tablet viewports, it displays a hamburger menu with a slide-down panel containing navigation links (Home, Event, Competition, Contact Us) plus PROFILE and LOGOUT buttons styled in green and red respectively.
- Dashboard header links use React Router navigation, preserving the active frontend authentication context when users move back to public Home, Event, Competition, or Contact Us pages.
- Dashboard competition cards use mobile-first stacking for verification badges, member identities, rejection details, and payment controls so long names and status labels do not overflow narrow viewports.

1. **User Authentication**:
    - The UI communicates with the backend for login/registration and OAuth flows.
    - Authentication tokens or secure cookies verify session status for protected routes (like the Dashboard).
    - Login, registration, and forgot-password pages share the Neo-Brutalist presentation and the application-wide dynamic footer while retaining the existing authentication API endpoints.
    - Authentication pages also reuse the shared public navbar, so Event, Competition, and Contact Us navigation returns to Home and scrolls to the corresponding section consistently.
    - Authentication input values preserve the user's original letter casing; uppercase styling is limited to labels and action text.
    - Shared-navbar logout calls the backend logout endpoint before clearing local authentication state, then redirects to `/login`, preventing an active Express session from immediately authenticating the user again.
2. **Dynamic Event Data**:
   - The frontend heavily relies on dynamic API fetching (e.g., `GET /api/events`) to ascertain which events/competitions are currently active (`is_active` flag) and if they require submissions (`requires_submission` flag).
   - This ensures the UI accurately mirrors the configuration set dynamically via the database instead of local hardcoded config files.
   - Competition registration routes resolve an event ID or normalized title to the event returned by the API, ensuring the form heading displays the competition name instead of a UUID.
   - Registration forms use `participation_type`: `team` requires a team name, while `individual` allows direct registration without that field.
   - Competition detail pages apply the same rule: individual registration asks for confirmation and submits directly, while team registration opens the team-name form.
   - The dashboard hides internal team names and join codes for individual competitions and labels the registered member as `Peserta`.
   - Direct individual registration requires explicit user confirmation before the API request is sent, preventing accidental enrollment.
   - Individual competition registration, team creation, and joining an existing team require complete personal and institutional profile fields. The frontend checks the current API profile before confirmation, opening, or submitting those flows, alerts with the missing fields, and redirects incomplete users to `/edit-profile`.
   - The participant `Daftar Event` and `Daftar Lomba` routes use a shared responsive neobrutalist dashboard shell. Their event/competition cards keep API calls, individual registration confirmation, team registration, and join-code behavior separate from visual styling.
   - The neobrutalist `Daftar Event` and `Daftar Lomba` lists paginate the already-fetched API data on the client, showing at most four cards per page with previous/next controls and clickable page indicators.
   - Team creation (`/register-competition/:competitionSlug`) reuses the same neobrutalist dashboard header, active sidebar state, and shared footer while preserving competition lookup, validation, registration payload, alerts, and redirects.
   - The existing Join Team toggle renders a dedicated neobrutalist main panel while preserving the same local state, `joinTeam(teamId)` request, loading state, cancel behavior, and success redirect.
   - Event registration (`/daftar-event/:target`) reuses the same neobrutalist dashboard shell and shared footer for loading, form, and success states while retaining its existing event checks, validation, registration/upload requests, WhatsApp actions, and redirects.
   - The event registration success state reads `whatsapp_group_link` from the selected non-competition event returned by the public API, so Admin controls the displayed group destination without frontend link mappings. Missing links render a safe unavailable notice.
   - Indonesian phone inputs in Edit Profile and event registration accept local `08...`, country-code `628...`, and international `+628...` forms, then normalize valid values to `+628...` before API submission.
   - All pages reuse `Footer.jsx` as the single Contact Us and navigation footer. The dashboard selects its neobrutalist variant while preserving the same event, competition, social-media, email, and WhatsApp destinations.
3. **File Uploads & Submissions**:
   - Users upload payment proofs and competition deliverables via the UI.
   - The frontend bundles files as `FormData` and sends them via Axios to the backend, which securely validates and stores them in Cloudflare R2 Storage (and subsequently the MySQL database).
