# IT Today Landing Page Integration Guide

This document is designed for the frontend and backend engineering teams responsible for building the IT Today Landing Page. It provides a comprehensive overview of the existing database schema, ensuring you have the necessary context to fetch and display dynamic content directly from our central database.

## Overview

The landing page needs to fetch dynamic data for **Events** (competitions and seminars), their respective **Timelines**, and global or event-specific **Announcements**.

All primary keys use UUID strings (VARCHAR 191). The relevant tables you will need to query are `event`, `event_timeline`, `event_announcement`, and `media` (for image assets).

---

## 1. Events Table (`event`)

The `event` table stores both competitions and non-competition events (e.g., seminars).

### Schema:
- `id` (VARCHAR 191, PK): UUID of the event.
- `title` (VARCHAR 255): The name of the event (e.g., "HackToday", "Seminar Nasional IT Today").
- `description` (TEXT): A detailed description of the event.
- `type` (VARCHAR 50): Defines the category. Can be either `competition` or `non_competition`.
- `registration_fee` (INT): The cost to register for the event.
- `min_team_members` (INT): Minimum members required (typically 1 for non-competitions).
- `max_team_members` (INT): Maximum members allowed per team.
- `requires_submission` (BOOLEAN/TINYINT): Indicates if the competition requires participants to upload a final submission file.
- `poster_id` (VARCHAR 191, FK): Foreign key linking to the `media` table for the event's poster image.
- `created_at`, `updated_at` (DATETIME)

**Querying Advice:** 
When displaying the list of competitions on the landing page, query `WHERE type = 'competition'`. For seminars, use `WHERE type = 'non_competition'`.

---

## 2. Event Timelines Table (`event_timeline`)

This table stores the schedule, agenda, and important dates for each event.

### Schema:
- `id` (VARCHAR 191, PK): UUID of the timeline entry.
- `event_id` (VARCHAR 191, FK): References `event.id`.
- `name` (VARCHAR 255): The title of the agenda/phase (e.g., "Pendaftaran Dibuka", "Babak Penyisihan", "Final").
- `start_date` (DATETIME): The starting date and time.
- `end_date` (DATETIME): The ending date and time.
- `location` (VARCHAR 255): Where it takes place (e.g., "Online", "Auditorium").
- `created_at`, `updated_at` (DATETIME)

**Querying Advice:** 
Fetch timelines by joining on `event_id` and order them chronologically using `ORDER BY start_date ASC` to build a clean chronological timeline on the landing page.

---

## 3. Announcements Table (`event_announcement`)

Announcements can either be tied to a specific event or broadcasted generally (Umum) to all landing page visitors.

### Schema:
- `id` (VARCHAR 191, PK): UUID of the announcement.
- `event_id` (VARCHAR 191, FK, **Nullable**): References `event.id`. If this is `NULL`, the announcement is intended for the general public or all participants (Kategori: Umum).
- `author_id` (VARCHAR 191, FK): References the admin/panitia who wrote the announcement.
- `title` (TEXT): The headline of the announcement.
- `description` (TEXT): The body content of the announcement.
- `created_at`, `updated_at` (DATETIME)

**Querying Advice:** 
- To show global announcements on the homepage: `WHERE event_id IS NULL`.
- To show announcements specific to an event page (e.g., inside the HackToday page): `WHERE event_id = ? OR event_id IS NULL`.
- Sort announcements with `ORDER BY created_at DESC` to show the most recent news first.

---

## 4. Media Table (`media`)

The media table handles all uploaded assets. You'll primarily use this to fetch event posters or announcement thumbnails.

### Schema:
- `id` (VARCHAR 191, PK): UUID of the media.
- `uploader_id` (VARCHAR 191, FK): References the user who uploaded the file.
- `grouping` (VARCHAR 255): Categorizes the media (e.g., `event_poster`, `payment_proof`).
- `url` (VARCHAR 255): The relative storage path to the file.
- `file_name` (VARCHAR 255): The original name of the file.
- `mime_type` (VARCHAR 255): e.g., `image/png`, `application/pdf`.
- `size` (INT): File size in bytes.

**Querying Advice:** 
To get an event's poster image URL, join `event.poster_id` with `media.id` and construct the full URL by appending the `url` field to your backend's public storage path (e.g., `https://api.ittoday.com/storage/{url}`).

---

## Recommended API Endpoints for the Landing Page

If the landing page team is building the API (or consuming it), here is the suggested RESTful structure based on the database:

1. `GET /api/v1/events` -> Returns a list of events. Supports query params `?type=competition` or `?type=non_competition`.
2. `GET /api/v1/events/{id}` -> Returns full event details, including `JOIN`s for `event_timeline`.
3. `GET /api/v1/announcements` -> Returns global announcements (`event_id IS NULL`).
4. `GET /api/v1/events/{id}/announcements` -> Returns announcements for a specific event + global announcements.
