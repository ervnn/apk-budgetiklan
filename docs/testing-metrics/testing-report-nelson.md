# Testing Report — Aplikasi Budget Iklan

**Nama:** Nelson Arbet
**Live App:** https://frontend-production-3768.up.railway.app/
**Tanggal Pengujian:** 09/07/2026

---

## 1. Fitur yang Diuji

1. Login (Admin & User)
2. Campaign Management (Create, Edit, Hapus)
3. Expense Input / Realisasi Pengeluaran

---

## 2. Test Case

| No | Fitur | Skenario | Expected Result | Status |
|----|-------|----------|------------------|--------|
| 1 | Login | Email & password benar (Admin) | Berhasil masuk ke Admin Dashboard | Pass |
| 2 | Login | Email & password benar (User) | Berhasil masuk ke User Dashboard | Pass |
| 3 | Login | Password salah | Muncul pesan error | Pass |
| 4 | Login | Email/password dikosongkan | Validasi form muncul, tidak bisa submit | Pass |
| 5 | Login | Format email tidak valid (misal: abc) | Validasi muncul | Pass |
| 6 | Campaign | Buat campaign baru dengan data lengkap | Campaign baru tersimpan dan muncul di list | Pass |
| 7 | Campaign | Buat campaign tanpa nama | Validasi muncul, tidak tersimpan | Pass |
| 8 | Campaign | Buat campaign dengan budget negatif | Validasi menolak input | Pass |
| 9 | Campaign | Edit campaign yang sudah ada | Data terupdate sesuai perubahan | Pass |
| 10 | Campaign | Hapus campaign | Campaign hilang dari daftar | Pass |
| 11 | Expense Input | Input realisasi pengeluaran valid | Data tersimpan dan mempengaruhi total realisasi | Pass |
| 12 | Expense Input | Input pengeluaran melebihi sisa budget | Muncul warning / ditolak sistem | Pass |
| 13 | Expense Input | Input nominal kosong/0 | Validasi muncul | Pass |
| 14 | Expense Input | Input nominal dengan format huruf (bukan angka) | Validasi menolak input | Pass |
| 15 | Expense Input | Edit/hapus data realisasi yang sudah diinput | Data terupdate/terhapus sesuai perubahan | Pass |

---

## 3. Perhitungan Metrik

### 3.1 Total Test Case
Total: **15**

### 3.2 Pass Rate
```
Pass Rate = (Jumlah PASS / Total Test Case) x 100%
          = ( 15 / 15 ) x 100%
          = 100%
```

### 3.3 Fail Rate
```
Fail Rate = (Jumlah FAIL / Total Test Case) x 100%
          = ( 0 / 15 ) x 100%
          = 0%
```

### 3.4 Defect Count

| Kategori | Jumlah | Deskripsi Bug |
| --- | --- | --- |
| Critical | 0 | - |
| Major | 0 | - |
| Minor | 0 | - |

### 3.5 Defect Density
```
Defect Density = Jumlah Bug / Jumlah Fitur
               = 0 bug / 3 fitur
               = 0 bug per fitur
```

---

## 4. Dokumentasi Bukti (Screenshot)

1. [Screenshot halaman Login]
2. [Screenshot halaman Campaign Management]
3. [Screenshot hasil test yang Pass]
4. [Screenshot bug/error yang ditemukan]
5. [Screenshot source code yang diperbaiki (jika ada)]

---

## 5. Analisis Hasil Pengujian

**Fitur mana yang paling banyak gagal?**

Tidak ada fitur yang gagal. Dari 15 test case yang dijalankan pada tiga fitur (Login, Campaign Management, dan Expense Input), seluruhnya menunjukkan hasil Pass, dengan Pass Rate 100%.

**Apa penyebabnya?**

Karena tidak ditemukan kegagalan, tidak ada penyebab bug yang perlu dianalisis. Hasil ini mengindikasikan bahwa validasi input dan alur fungsional pada ketiga fitur yang diuji (autentikasi, pengelolaan campaign, dan pencatatan realisasi pengeluaran) sudah berjalan sesuai dengan expected result pada setiap skenario pengujian.

**Bagaimana cara memperbaikinya?**

Karena tidak ada bug yang ditemukan pada pengujian ini, tidak ada perbaikan yang perlu dilakukan pada fitur-fitur yang diuji. Meskipun demikian, disarankan untuk tetap melakukan pengujian tambahan di luar 15 skenario ini (misalnya edge case lain seperti input karakter khusus, uji beban data dalam jumlah besar, atau pengujian di berbagai browser/perangkat) untuk memastikan cakupan pengujian yang lebih menyeluruh di iterasi berikutnya.

**Apa prioritas perbaikannya?**

Tidak ada prioritas perbaikan yang mendesak untuk saat ini karena seluruh test case dinyatakan Pass. Prioritas ke depan lebih diarahkan pada perluasan cakupan pengujian (menambah jumlah dan variasi test case) dibanding perbaikan bug.

**Jika aplikasi akan dirilis minggu ini, apakah sudah layak? Jelaskan.**

Berdasarkan hasil pengujian pada 15 test case di tiga fitur utama dengan Pass Rate 100% dan tidak ditemukannya defect, aplikasi ini **layak untuk dirilis** minggu ini ditinjau dari sisi fungsional yang diuji. Namun, kelayakan ini terbatas pada cakupan pengujian yang dilakukan; disarankan tetap memantau performa aplikasi pasca-rilis dan melanjutkan pengujian pada fitur lain (seperti Dashboard, Performa, dan Laporan) yang belum tercakup dalam pengujian ini.
