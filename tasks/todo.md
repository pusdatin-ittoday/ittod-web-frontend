# API Optimization Todo List

## Phase 1: Deduplication & Cache
- [x] Task 1.1: Buat modul `src/utils/apiDedupe.js`
- [x] Task 1.2: Sambungkan deduplicator pada `src/api/axios.js`
- [x] Task 1.3: Sambungkan deduplicator pada `src/services/api.js`

## Phase 2: Guest Optimization
- [x] Task 2.1: Tambahkan guard pengecekan authToken di `getCurrentUser()` (`src/api/user.js`)

## Verification
- [ ] Push dan build ke Dokploy
- [ ] Pantau pengurangan request di Network tab
