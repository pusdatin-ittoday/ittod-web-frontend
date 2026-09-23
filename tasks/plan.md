# Implementation Plan: API Request Deduplication & In-Memory Caching

## Overview
Mengeliminasi request duplikat serentak (4x user, 3x announcements, 2x results, dll) yang menyebabkan bottleneck pada server Dokploy 2-core hingga mencapai latensi 6 detik.

## Architecture Decisions
- **In-Flight Promise Sharing**: Request GET yang identik saat sedang pending akan berbagi Promise yang sama.
- **Short TTL Cache**: Data read-only disimpan sementara 15-30s di memori frontend.
- **Auto Invalidation**: Mutasi (POST, PUT, DELETE, PATCH) mereset cache terkait.
- **Guest Token Guard**: Mencegah request `/api/user` sia-sia jika tidak ada authToken.

## Task List
- [ ] Task 1: Buat modul `src/utils/apiDedupe.js`
- [ ] Task 2: Pasang deduplikasi & caching di `src/api/axios.js` dan `src/services/api.js`
- [ ] Task 3: Tambahkan guard unauthenticated di `getCurrentUser()` pada `src/api/user.js`

## Checkpoint
- [ ] Build & lint valid
- [ ] Amati pengurangan request di Network tab
