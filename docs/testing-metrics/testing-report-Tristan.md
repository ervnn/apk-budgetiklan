# Testing Report — Aplikasi Manajemen Budgeting Campaign

**Disusun oleh:** [Nama Kamu]
**NIM:** [NIM Kamu]
**Repository:** [link repo GitHub]
**Tanggal Pengujian:** [tanggal]

---

## 1. Fitur yang Diuji

Pengujian dilakukan pada 3 fitur utama aplikasi:

1. **Login** — autentikasi pengguna untuk mengakses sistem.
2. **CRUD Data Campaign** — kelola data campaign budgeting (create, read, update, delete campaign beserta alokasi budget-nya).
3. **Dashboard** — menampilkan ringkasan/visualisasi penggunaan budget per campaign.

---

## 2. Test Case

| No | Fitur | Skenario | Expected Result | Status |
| --- | --- | --- | --- | --- |
| 1 | Login | Email dan password benar | Berhasil login, redirect ke dashboard | Pass |
| 2 | Login | Password salah | Muncul pesan error "Password salah" | Pass |
| 3 | Login | Email tidak terdaftar | Muncul pesan error "Akun tidak ditemukan" | Pass |
| 4 | Login | Klik "logout" | User keluar, kembali ke halaman login | Pass |
| 5 | CRUD Data | Tambah campaign baru dengan data lengkap | Campaign tersimpan dan muncul di list | Pass |
| 6 | CRUD Data | Edit nominal budget campaign | Data ter-update sesuai input baru | Pass |
| 7 | CRUD Data | Hapus campaign | Campaign hilang dari list, konfirmasi delete muncul | Pass |
| 8 | CRUD Data | Lihat detail satu campaign | Data detail sesuai dengan data yang diinput | Pass |
| 9 | CRUD Data | Cari campaign dengan keyword | List hasil pencarian sesuai keyword | Pass |
| 10 | Dashboard | Buka dashboard setelah login | Ringkasan total budget & jumlah campaign tampil | Pass |
| 11 | Dashboard | Filter dashboard berdasarkan periode | Data grafik berubah sesuai periode terpilih | Pass |
| 12 | Dashboard | Tambah campaign baru, cek dashboard | Total budget di dashboard ter-update otomatis | Pass |
| 13 | Dashboard | Buka dashboard tanpa data campaign | Tampil state kosong ("belum ada campaign") | Pass |
| 14 | Dashboard | Buka dashboard di layar kecil (mobile) | Layout tetap rapi, grafik tidak terpotong | Pass |
| 15 | Dashboard | Klik salah satu campaign di grafik | Redirect ke halaman detail campaign terkait | Pass |

---

## 3. Perhitungan Metrik

### 3.1 Total Test Case
**15** test case

### 3.2 Pass Rate

```
Pass Rate = (Jumlah PASS / Total Test Case) x 100%
          = (15 / 15) x 100%
          = 100%
```

### 3.3 Fail Rate

```
Fail Rate = (Jumlah FAIL / Total Test Case) x 100%
          = (0 / 15) x 100%
          = 0%
```

### 3.4 Defect Count

| Kategori | Jumlah | Keterangan |
| --- | --- | --- |
| Critical | 0 | - |
| Major | 0 | - |
| Minor | 0 | - |
| **Total** | **0** | Tidak ditemukan bug pada pengujian ini |

### 3.5 Defect Density (Sederhana)

```
Defect Density = Jumlah Bug / Jumlah Fitur
               = 0 bug / 3 fitur
               = 0 bug per fitur
```

---

## 4. Dokumentasi Bukti

> Lampirkan minimal 5 screenshot berikut (ganti placeholder di bawah dengan gambar asli hasil pengujianmu):

1. ![Halaman Login](./screenshots/real_ss2_admin_login.png)
2. ![List Campaign](./screenshots/campaign-list.png)
3. ![Form Tambah Campaign](./screenshots/real_ss4_campaign.png)
4. ![Dashboard](./screenshots/real_ss3_dashboard.png)
5. ![Hasil Pengujian CRUD Data](./screenshots/real_ss_jest_cmd.png)

---

## 5. Analisis Hasil Pengujian

Dari 15 test case yang dijalankan pada tiga fitur utama (Login, CRUD Data Campaign, dan Dashboard), seluruh test case dinyatakan **Pass**, sehingga tidak ada fitur yang mengalami kegagalan pada pengujian ini. Ketiga fitur berjalan sesuai dengan expected result yang telah ditetapkan, mulai dari proses autentikasi, pengelolaan data campaign (create, read, update, delete), hingga penyajian ringkasan budget di dashboard.

Karena tidak ditemukan defect pada pengujian ini, tidak ada penyebab kegagalan maupun langkah perbaikan (bug fix) yang perlu dijabarkan. Meski demikian, hasil 100% pass rate ini didapat dari skenario pengujian yang bersifat fungsional dasar (happy path dan sebagian validasi input). Untuk meningkatkan keyakinan terhadap kualitas aplikasi, cakupan pengujian sebaiknya diperluas ke skenario edge case yang lebih menantang, misalnya input nominal budget negatif atau nol, karakter khusus pada field teks, submit form dengan field kosong, serta pengujian dengan volume data besar untuk melihat performa dashboard.

Dari sisi prioritas, karena belum ditemukan bug, prioritas saat ini diarahkan pada **penambahan cakupan pengujian (test coverage)**, khususnya untuk skenario validasi input dan kondisi batas (boundary testing), agar potensi bug yang belum tercakup pada 15 test case ini dapat terdeteksi lebih awal sebelum aplikasi digunakan secara luas.

Jika aplikasi ini rencananya dirilis minggu ini, menurut saya **cukup layak untuk dirilis** dilihat dari hasil pengujian saat ini, karena seluruh fitur inti (Login, CRUD Data Campaign, Dashboard) berfungsi sesuai harapan dengan pass rate 100%. Namun demikian, mengingat cakupan pengujian yang masih terbatas pada skenario dasar, disarankan untuk tetap melakukan pengujian tambahan pada skenario edge case sebelum rilis final, agar risiko bug yang belum terdeteksi dapat diminimalkan.

---

## 6. Commit & Push

```
git add docs/testing-metrics/testing-report.md
git commit -m "docs: add testing metrics report"
git push
```

---

## 7. Output yang Dikumpulkan

- Link Repository GitHub: [isi di sini]
- Link file `testing-report.md`: [isi di sini]
- File PDF hasil report (opsional): [isi di sini]

---

## 8. Nilai Tambahan (Opsional, +10)

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

