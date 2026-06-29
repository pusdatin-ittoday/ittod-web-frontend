# IT-TODAY Frontend

Frontend platform IT-TODAY 2025 yang dibangun dengan React, Vite, Tailwind CSS, dan Axios. Aplikasi ini menyediakan landing page, autentikasi, dashboard peserta, pendaftaran event dan kompetisi, serta pengiriman submission.

## Teknologi

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Prasyarat

Pastikan perangkat sudah memiliki:

- Node.js 20 LTS atau versi yang lebih baru
- npm
- Git
- Backend IT-TODAY yang berjalan di `http://localhost:3000`

## Instalasi

Clone repository dan pasang dependency:

```bash
git clone https://github.com/pusdatin-ittoday/ittod-web-frontend.git
cd ittod-web-frontend
npm install
```

## Konfigurasi environment

Salin template environment:

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

Isi `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

`VITE_API_BASE_URL` adalah base URL backend. Jangan menambahkan `/api` atau trailing slash karena endpoint aplikasi sudah menyertakan path `/api/...`.

Semua variabel frontend yang ingin tersedia pada kode browser harus memiliki prefix `VITE_`. Jangan menaruh password, API secret, atau credential privat di environment frontend karena nilainya akan masuk ke bundle browser.

Setelah mengubah `.env`, restart Vite agar nilai environment dimuat ulang.

## Menjalankan aplikasi

Pastikan backend dan MySQL sudah berjalan. Kemudian jalankan:

```bash
npm run dev
```

Buka:

```text
http://localhost:5173
```

## Menjalankan backend

Di terminal terpisah:

```bash
cd ../ittod-web-api
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend dapat dicek melalui `http://localhost:3000`. Endpoint root harus menampilkan `OK`.

## Build production

Buat production bundle:

```bash
npm run build
```

Hasil build tersimpan di folder `dist`.

Preview hasil build:

```bash
npm run preview
```

Preview berjalan di `http://localhost:5173`.

## Perintah npm

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan Vite development server. |
| `npm run build` | Membuat production bundle. |
| `npm run preview` | Menjalankan preview production bundle. |
| `npm run lint` | Memeriksa kode menggunakan ESLint. |
| `npm audit` | Memeriksa vulnerability dependency. |

## Urutan menjalankan project lokal

1. Jalankan MySQL melalui XAMPP atau service MySQL lokal.
2. Jalankan backend dengan `npm run dev` di folder `ittod-web-api`.
3. Jalankan frontend dengan `npm run dev` di folder `ittod-web-frontend`.
4. Buka `http://localhost:5173`.

Apache XAMPP tidak diperlukan untuk React atau Express. Apache hanya diperlukan jika ingin membuka phpMyAdmin melalui browser.

## Troubleshooting

### Halaman terbuka tetapi request API gagal

Periksa:

- Backend aktif di `http://localhost:3000`.
- `.env` berisi `VITE_API_BASE_URL=http://localhost:3000`.
- Terminal backend tidak menampilkan error database.
- Vite sudah direstart setelah `.env` diubah.

### Perubahan `.env` tidak terbaca

Hentikan Vite dengan `Ctrl+C`, kemudian jalankan kembali:

```bash
npm run dev
```

### Port `5173` sudah dipakai

Hentikan proses Vite lain yang masih berjalan. Project ini dikonfigurasi menggunakan port `5173` agar sesuai dengan konfigurasi CORS backend.

### Login Google atau email verifikasi gagal

Fitur tersebut memerlukan credential Google OAuth dan SMTP pada `.env` backend. Lihat README backend untuk detail konfigurasinya.

## License

Lihat [LICENSE](LICENSE).
