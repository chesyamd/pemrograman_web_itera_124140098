# Personal Dashboard Mahasiswa

Aplikasi **Personal Dashboard Mahasiswa** berbasis web yang dibangun dengan **JavaScript Next Gen (ES6+)** untuk membantu pengelolaan agenda akademik, jadwal kuliah, dan informasi cuaca Bandar Lampung.

> **Identitas Mahasiswa:**  
> Nama: **Chesya Margaretha Deto**  
> NIM: **124140098**  
> Kelas: **Praktikum PAW RB**  
> Mata Kuliah: **Praktikum Pengembangan Aplikasi Web (Pertemuan 2)**

---

## Deskripsi Aplikasi

Dashboard ini menggabungkan agenda pribadi dan akademik dengan jadwal kelas mingguan, ringkasan produktivitas, serta widget cuaca. Data agenda disimpan secara lokal agar tetap tersedia setelah halaman dimuat ulang.

### Fitur Utama

1. **Manajemen Agenda (CRUD):**
   - **Tambah:** Simpan nama, kategori, tanggal, waktu, status, dan catatan.
   - **Tampilkan & Saring:** Lihat agenda dalam satu daftar yang diurutkan berdasarkan tanggal dan waktu. Filter waktu `H-3 sampai Hari H` menampilkan agenda bertanggal dalam rentang tiga hari menuju tenggat hingga hari tenggat.
   - **Status:** Tandai agenda selesai atau aktifkan kembali langsung dari kartu agenda. Label tanggal menampilkan `H-3`, `H-2`, `H-1`, `Hari H`, atau `Terlambat` sesuai waktunya.
   - **Sunting & Hapus:** Ubah agenda melalui formulir dan hapus melalui modal konfirmasi.
2. **Penyimpanan Lokal Persisten (`localStorage`):** Agenda dan jadwal rutin disimpan terpisah dan dipertahankan saat halaman dimuat ulang.
   - Data contoh awal mencakup laporan praktikum, rapat organisasi, belanja kebutuhan rumah, kelas pengganti Jarkom, dan review proposal volunteer. Data contoh hanya dibuat jika key agenda belum tersedia.
3. **Ringkasan Produktivitas:** Jumlah agenda aktif, selesai, dan terlambat.
4. **Jadwal Kelas Mingguan:** Jadwal rutin ditampilkan per hari; kelas rutin tidak disalin sebagai agenda baru. Agenda kelas pengganti dapat dimasukkan sebagai agenda biasa.
5. **Widget Cuaca Open-Meteo:** Menampilkan suhu, kondisi, kelembapan, kecepatan angin, dan suhu terasa untuk Bandar Lampung, dengan tombol refresh serta state loading/error.
6. **Desain Responsif:** Antarmuka soft pink untuk desktop, tablet, dan mobile.

Filter waktu bukan notifikasi. Versi ini tidak menyediakan notifikasi browser atau kutipan motivasi.

---

## Screenshot Antarmuka

### Dashboard Utama

![Tampilan dashboard utama](<docs copy/screenshots/gambar3.png>)

### Form dan Daftar Agenda

![Form dan daftar agenda](<docs copy/screenshots/gambar1.png>)

### Jadwal Kelas

![Jadwal kelas mingguan](<docs copy/screenshots/gambar2.png>)

---

## Fitur ES6+ yang Diimplementasikan

| No. | Fitur ES6+ | File Sumber | Baris Kode | Implementasi |
|:--:|---|---|:--:|---|
| 1 | `const` dan `let` | `app.js` | 81, 127 | Konfigurasi state dan penanda migrasi jadwal. |
| 2 | Arrow functions | `app.js` | 37–59 | Event listener form, filter tanggal, modal, dan aksi kartu. |
| 3 | Template literals | `app.js`, `dashboard.js` | 158, 283, 374; 112–213 | Label tanggal dinamis dan markup agenda/jadwal/cuaca. |
| 4 | `async`/`await` dan `fetch()` | `app.js`, `dashboard.js` | 437–444; 83–85 | Mengambil data cuaca dari Open-Meteo. |
| 5 | Classes (OOP) | `app.js`, `dashboard.js` | 11; 47–64, 89 | Class `DashboardApp`, `TaskItem`, dan `DashboardView`. |
| 6 | Destructuring | `app.js`, `dashboard.js` | 212–213; 144 | Mengurai tanggal/waktu dan properti agenda saat render. |
| 7 | Spread operator (`...`) | `app.js`, `dashboard.js` | 188, 317; 12–14, 61, 139–140 | Menyalin daftar/objek dan menggabungkan agenda hari ini. |
| 8 | Default parameters | `dashboard.js` | 48 | Nilai default untuk kategori, tanggal, waktu, catatan, status, dan timestamp agenda. |
| 9 | Array methods | `app.js`, `dashboard.js` | 105–106, 188, 247–271; 117–183 | Penggunaan `.map()`, `.filter()`, `.find()`, dan `.sort()`. |
| 10 | ES Modules (`import`/`export`) | `app.js`, `dashboard.js` | 1–9; 1, 47, 83, 89 | Menghubungkan controller, model, layanan, dan renderer. |
| 11 | DOM manipulation & event handling | `index.html`, `app.js`, `dashboard.js` | 20–165; 37–69; 94–213 | Menghubungkan elemen halaman, menangani aksi, dan merender UI. |

## Struktur Berkas Proyek

```text
.
├── index.html
├── app.js                 # State, event, CRUD, penyimpanan, dan filter tanggal
├── dashboard.js           # TaskItem, DashboardView, jadwal, dan layanan cuaca
├── styles.css             # Variabel, reset, layout, dan breakpoint responsif
├── components.css         # Kartu, formulir, tombol, jadwal, dan modal
├── README.md
└── docs copy/
   └── screenshots/
      ├── gambar1.png
      ├── gambar2.png
      └── gambar3.png
```

## Cara Menjalankan Aplikasi

Karena aplikasi memakai ES Modules (`type="module"`), jalankan melalui web server lokal, bukan dengan membuka `index.html` melalui `file://`.

```bash
python3 -m http.server 8000
```

Buka `http://localhost:8000/` di browser.

## Integrasi Open-Meteo

Widget menggunakan koordinat tetap Bandar Lampung: latitude `-5.4292`, longitude `105.2610`, dengan zona waktu `Asia/Jakarta`. Data diambil menggunakan `fetch()` dan `async/await`. Jika permintaan gagal, aplikasi menampilkan state error; tombol Refresh dapat digunakan untuk mencoba kembali.

## Hasil Pengujian

Pengujian browser yang telah dilakukan mencakup tambah/edit/hapus agenda, pengurutan, perubahan dan persistensi status, filter `H-3 sampai Hari H`, label tanggal, jadwal mingguan, serta cuaca berhasil/gagal dan refresh. Responsif juga diperiksa pada ukuran mobile, tablet, dan desktop; tidak ditemukan page error JavaScript pada alur yang diuji.

## Catatan Implementasi

- Agenda menggunakan key `paw-personal-tasks-v1`; jadwal rutin menggunakan `paw-weekly-schedule-v1`.
- Status selesai tetap tersimpan sampai pengguna menghapus agenda melalui modal konfirmasi.
- Filter waktu hanya memengaruhi tampilan daftar dan tidak menghapus atau mengubah data agenda.
- Notifikasi browser dan kutipan motivasi tidak termasuk fitur aplikasi saat ini.
