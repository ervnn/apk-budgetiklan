# Testing Metrics Report
## Sistem Pengelolaan Anggaran Iklan Digital

| | |
|---|---|
| **Nama Mahasiswa** | Ervin Setyanata Kusuma |
| **NIM** | 103012430007 |
| **Tanggal Pengujian** | 8 Juli 2026 |
| **Mata Kuliah** | Implementasi dan Pengujian Perangkat Lunak |
| **Teknologi Testing** | **Jest** (Node.js) + Supertest |

---

## Fitur yang Diuji

Tiga fitur utama yang dipilih untuk pengujian:

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | **Autentikasi (Login)** | Proses login user/admin menggunakan email dan password dengan validasi JWT token |
| 2 | **Manajemen Campaign (CRUD)** | Create, Read, Update, Delete data kampanye iklan beserta proteksi otentikasi |
| 3 | **Dashboard & Health Check** | Ringkasan anggaran, performa kampanye, dan monitoring status API server |

---

## Test Case

### Tabel Test Case (15 Test Case)

| No | Fitur | Skenario | Expected Result | Status |
|----|-------|----------|-----------------|--------|
| TC-01 | Login | Email dan password kosong | HTTP 400, pesan "harus diisi" | ✅ Pass |
| TC-02 | Login | Email kosong, password ada | HTTP 400, validasi muncul | ✅ Pass |
| TC-03 | Login | Password kosong, email ada | HTTP 400, validasi muncul | ✅ Pass |
| TC-04 | Login | Email dan password salah (tidak terdaftar) | HTTP 401, login gagal | ✅ Pass |
| TC-05 | Login | Input string kosong ("") | HTTP 400, struktur JSON benar (ada field `success` & `message`) | ✅ Pass |
| TC-06 | Campaign CRUD | GET semua campaign tanpa token | HTTP 401, akses ditolak | ✅ Pass |
| TC-07 | Campaign CRUD | GET campaign dengan token tidak valid (palsu) | HTTP 401, akses ditolak | ✅ Pass |
| TC-08 | Campaign CRUD | POST buat campaign baru tanpa token | HTTP 401, akses ditolak | ✅ Pass |
| TC-09 | Campaign CRUD | DELETE campaign tanpa token | HTTP 401, akses ditolak | ✅ Pass |
| TC-10 | Campaign CRUD | PUT update campaign tanpa token | HTTP 401, akses ditolak | ✅ Pass |
| TC-11 | Dashboard | GET /api/health – server berjalan | HTTP 200, `success: true`, pesan "Budget Iklan" | ✅ Pass |
| TC-12 | Dashboard | GET /api/health – validasi field timestamp | HTTP 200, field `timestamp` ada dan valid | ✅ Pass |
| TC-13 | Dashboard | Akses route yang tidak ada | HTTP 404, `success: false` | ✅ Pass |
| TC-14 | Dashboard | GET summary dashboard tanpa token | HTTP 401, akses ditolak | ✅ Pass |
| TC-15 | Dashboard | Respons 404 memiliki format JSON benar | HTTP 404, ada field `success` dan `message` | ✅ Pass |

---

## Perhitungan Metrik

### 1. Total Test Case
```
Total Test Case = 15
```

### 2. Pass Rate
```
Pass Rate = (Jumlah PASS / Total Test Case) × 100%
          = (15 / 15) × 100%
          = 100%
```

### 3. Fail Rate
```
Fail Rate = (Jumlah FAIL / Total Test Case) × 100%
           = (0 / 15) × 100%
           = 0%
```

> **Catatan:** Pada run pertama Jest, TC-01 gagal karena **port conflict** (`EADDRINUSE :::5000`) — server `npm run dev` sudah aktif di port 5000 saat test dijalankan. Setelah diperbaiki dengan menambahkan pengecekan `require.main === module` di `server.js`, seluruh 15 test case berhasil PASS dalam waktu **4.222 detik**. Bug ini dikategorikan sebagai **Minor** karena hanya terjadi saat test environment bentrok dengan server dev, tidak mempengaruhi fungsionalitas aplikasi nyata.

### 4. Defect Count

| Kategori | Jumlah | Deskripsi |
|----------|--------|-----------|
| **Critical** | 0 | Tidak ada bug yang menghentikan fungsi utama aplikasi |
| **Major** | 0 | Tidak ada bug yang mempengaruhi fungsionalitas signifikan |
| **Minor** | 1 | Port conflict (`EADDRINUSE :::5000`) saat Jest dijalankan berbarengan dengan server dev yang aktif – sudah diperbaiki dengan `require.main === module` di `server.js` |

**Total Bug:** 1 (sudah diperbaiki)

### 5. Defect Density

```
Defect Density = Jumlah Bug / Jumlah Fitur
               = 1 / 3
               = 0.33 bug per fitur
```

> Nilai ini sangat rendah, menunjukkan kualitas kode yang baik.

---

## Dokumentasi Bukti (Screenshot)

### Screenshot 1 – Hasil Eksekusi Jest (15/15 PASS)
![SS Jest Results](./screenshots/real_ss_jest_cmd.png)

> Output terminal Jest: **15 test case PASS semua** dalam waktu **4.222 detik**. Dijalankan dengan perintah `npm test -- --verbose` di folder `backend/`. Tool: **Jest v29 + Supertest v6**.

---

### Screenshot 2 – Halaman Seleksi / Landing Page
![SS Seleksi](./screenshots/real_ss1_selection.png)

> Halaman utama aplikasi **AdBudget Manager** menampilkan dua pilihan: Portal Admin (Manajemen Perusahaan) dan Ruang Kerja Pengguna (Operasi Kampanye).

---

### Screenshot 3 – Halaman Login Admin
![SS Login Admin](./screenshots/real_ss2_admin_login.png)

> Form login Admin dengan field Email dan Kata Sandi. Diproteksi **rate limiter** (10 request/15 menit) untuk mencegah brute force — diuji pada TC-01 s/d TC-05.

---

### Screenshot 4 – Dashboard Admin (Dasbor Anggaran)
![SS Dashboard](./screenshots/real_ss3_dashboard.png)

> Dashboard Admin: Total Anggaran **Rp 3.400.121**, Total Realisasi Rp 2.700.121 (79%), Total Revenue Rp 3.383.500, dan daftar kampanye aktif. Endpoint diproteksi JWT (TC-14).

---

### Screenshot 5 – Halaman Manajemen Kampanye (CRUD)
![SS Campaign](./screenshots/real_ss4_campaign.png)

> Halaman Manajemen Kampanye: tabel data dengan kolom Nama, ID, Platform, Durasi, Anggaran, dan tombol Aksi (Edit/Hapus). Seluruh endpoint CRUD diproteksi token (TC-06 s/d TC-10).

---

### Screenshot 6 – Halaman Laporan Anggaran Iklan
![SS Laporan](./screenshots/real_ss5_laporan.png)

> Laporan menampilkan: Budget vs Realisasi (79%), Revenue IDR 3.4Jt, ROI 25%, ROAS 1.3x, grafik Tren Revenue vs Biaya, dan performa antar platform.

---

### Screenshot 7 – Halaman Login Pengguna (Operator)
![SS Login User](./screenshots/real_ss6_user_login.png)

> Form Login Pengguna/Operator — akses terpisah dari Admin untuk menjaga keamanan berbasis role (JWT). Pengguna hanya bisa akses input realisasi dan performa kampanye.

---

## Langkah 5 – Analisis

### Fitur Mana yang Paling Banyak Gagal?

Berdasarkan hasil pengujian, **tidak ada fitur yang gagal secara keseluruhan**. Seluruh 15 test case berhasil PASS dengan Pass Rate 100%. Namun, selama proses development pengujian ditemukan **1 bug Minor** pada konfigurasi test environment — bukan pada logika bisnis aplikasi.

### Apa Penyebabnya?

Bug yang ditemukan berupa **port conflict** (`EADDRINUSE: address already in use :::5000`). Penyebabnya adalah `server.js` secara default langsung memanggil `app.listen(PORT)` setiap kali file tersebut di-`require()`. Saat Jest menjalankan test, file `server.js` di-load oleh `auth.test.js`, sehingga server mencoba menyalakan port 5000 — padahal server development (`npm run dev`) sudah aktif di port yang sama, menyebabkan TC-01 gagal dengan error port conflict.

Ini bukan bug pada logika fitur aplikasi, melainkan masalah konfigurasi antara server development dan test runner.

### Bagaimana Cara Memperbaikinya?

Perbaikan dilakukan di `server.js` dengan membungkus `app.listen()` menggunakan pengecekan `require.main === module`. Dengan ini, server hanya menyalakan port ketika file dijalankan langsung (`node server.js` / `nodemon`), tetapi **tidak** menyalakan port ketika file di-`require()` oleh Jest. Setelah perbaikan ini, seluruh 15 test case berhasil PASS dalam waktu **4.222 detik**.

Perbaikan yang sama juga merupakan best practice Node.js standar untuk memisahkan server startup dari module export.

### Apa Prioritas Perbaikannya?

| Prioritas | Item | Status |
|-----------|------|--------|
| 🟢 Rendah | Port conflict saat Jest + server dev berjalan bersamaan | ✅ Sudah diperbaiki (`require.main === module`) |
| 🟡 Sedang | Tambahkan mock database untuk unit test yang murni terisolasi | 🔄 Rekomendasi |
| 🔴 Tinggi | Tidak ada bug kritikal yang ditemukan | ✅ N/A |

### Apakah Aplikasi Layak Dirilis Minggu Ini?

**Ya, aplikasi layak untuk dirilis dengan catatan minor.**

Alasan aplikasi sudah layak:

1. **Autentikasi aman** – Sistem login diproteksi dengan JWT token berumur 24 jam, bcrypt untuk hashing password, dan rate limiter untuk mencegah brute force. Semua test validasi PASS.

2. **Proteksi data** – Seluruh endpoint sensitif (campaign, dashboard, laporan) memerlukan token yang valid. Akses tanpa token atau dengan token palsu langsung ditolak dengan HTTP 401.

3. **Penanganan error yang baik** – Semua respons API memiliki struktur JSON konsisten (`success`, `message`), termasuk untuk error 400, 401, dan 404.

4. **Security headers** – Helmet.js sudah terpasang untuk mencegah serangan umum berbasis HTTP headers.

**Catatan untuk rilis:** Disarankan memastikan variabel environment production (`SUPABASE_URL`, `JWT_SECRET`) telah dikonfigurasi dengan benar, dan mempertimbangkan upgrade Node.js ke versi 20+ untuk kompatibilitas penuh dengan library Supabase.

---

## Nilai Tambahan – Penggunaan Jest (Tool Testing Otomatis)

### Tool yang Digunakan
- **Jest** v29 (Node.js Unit & Integration Testing Framework)  
- **Supertest** v6 (HTTP assertion library untuk testing Express API)

### Cara Menjalankan Test
```bash
# Install dependencies
cd backend
npm install

# Jalankan semua test
npm test

# Jalankan dengan output verbose
npm test -- --verbose
```

### File Test
- **Lokasi:** `backend/tests/auth.test.js`
- **Total Test Case:** 15
- **Coverage:** Login API, Campaign CRUD API, Dashboard & Health Check API

### Hasil Eksekusi
```
PASS tests/auth.test.js (4.222 s)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        4.222 s, estimated 6 s
```

### Penjelasan Singkat

Jest digunakan untuk melakukan **integration testing** pada REST API backend menggunakan Supertest. Setiap test case mengirimkan HTTP request ke endpoint aplikasi dan memverifikasi:
- **Status code** HTTP yang dikembalikan (200, 400, 401, 404)
- **Struktur JSON** respons (field `success`, `message`, `data`)
- **Nilai field** tertentu (contoh: `success: true`, `message` berisi string tertentu)

Test dikelompokkan dalam tiga `describe` block sesuai fitur yang diuji, sehingga laporan output Jest mudah dibaca dan terstruktur.

---

*Dibuat pada: 8 Juli 2026 | Sistem Pengelolaan Anggaran Iklan Digital*
