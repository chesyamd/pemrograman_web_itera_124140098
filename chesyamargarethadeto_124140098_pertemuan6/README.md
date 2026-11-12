# Praktikum PAW Pertemuan 6 — RESTful API Manajemen Data (Pyramid Framework)

## Identitas Praktikan

- **Nama:** Chesya Margaretha Deto
- **NIM:** 124140098
- **Kelas:** RB 
- **Pertemuan:** 6 

## Deskripsi

Aplikasi RESTful API sederhana yang dikembangkan menggunakan **Pyramid Framework** (Python),
**PostgreSQL** sebagai database, **SQLAlchemy ORM** sebagai pemetaan objek-relasional, dan
**Alembic** untuk migrasi skema database. Aplikasi ini mengimplementasikan CRUD lengkap untuk dua
modul:

1. **Manajemen Data Mahasiswa** (modul praktikum) — `/api/mahasiswa`
2. **Manajemen Data Matakuliah** (tugas) — `/api/matakuliah`

## Teknologi

- Python 3.14 · Pyramid 1.10 · SQLAlchemy 2.x · Alembic · PostgreSQL 18
- WSGI server: Waitress · Template: Jinja2

## Struktur Direktori

```text
pyramid_mahasiswa/                 # Root proyek
├── development.ini               # Konfigurasi server lokal & database dev
├── production.ini                # Konfigurasi deployment production
├── setup.py                     # Metadata & dependensi package Python
├── pytest.ini
├── README.md                    # Dokumen ini
├── .gitignore                   # Mengabaikan venv/, __pycache__/, *.sqlite, egg-info
└── pyramid_mahasiswa/           # Python package aplikasi
    ├── __init__.py              # Entry point WSGI & konfigurasi app
    ├── routes.py                # Peta URL Dispatch (routing REST API)
    ├── alembic/                 # Migrasi skema database (Alembic)
    │   ├── env.py
    │   └── versions/
    │       ├── 20261112_7012107f72ca.py   # create mahasiswa table
    │       └── 20261112_c36185151261.py   # create matakuliah table
    ├── models/
    │   ├── __init__.py          # Engine SQLAlchemy & Session Factory
    │   ├── meta.py              # Declarative Base
    │   ├── mahasiswa.py         # Model ORM tabel mahasiswa
    │   └── matakuliah.py        # Model ORM tabel matakuliah
    ├── scripts/
    │   └── initialize_db.py     # Seeding data awal (idempoten)
    └── views/
        ├── default.py           # View bawaan template
        ├── mahasiswa.py         # CRUD endpoint Mahasiswa
        └── matakuliah.py        # CRUD endpoint Matakuliah
```

## Cara Instalasi & Menjalankan

### 1. Clone repositori

```bash
git clone https://github.com/chesyamd/pemrograman_web_itera_124140098.git
cd pemrograman_web_itera_124140098/chesyamargarethadeto_124140098_pertemuan6
```

### 2. Buat virtual environment & instal dependensi

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install --upgrade pip setuptools
pip install -e ".[testing]"
pip install psycopg2-binary
```

### 3. Siapkan database PostgreSQL

```bash
psql -U postgres
```
```sql
CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;
\c pyramid_mahasiswa
GRANT ALL ON SCHEMA public TO pyramid_user;   -- wajib PostgreSQL 15+
\q
```

> Konfigurasi `sqlalchemy.url` di `development.ini` sudah mengarah ke PostgreSQL di atas
> (`postgresql+psycopg2://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa`).
> **Catatan:** prefiks dialek `+psycopg2` wajib, karena SQLAlchemy 2.x default ke driver
> `psycopg` v3. Ganti kredensial/host sesuai environment masing-masing.

### 4. Migrasi database (Alembic) & seeding data awal

```bash
alembic -c development.ini upgrade head
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

Skrip seeding bersifat **idempoten** — data yang sudah ada tidak akan dimasukkan ulang,
sehingga aman dijalankan berkali-kali.

### 5. Jalankan server

```bash
pserve development.ini --reload
```

Server berjalan di `http://localhost:6543` (lihat baris `listen` pada `development.ini`).

## Daftar Endpoint

### Mahasiswa — `/api/mahasiswa`

| Method | Path | Deskripsi | Sukses | Gagal |
|--------|------|-----------|--------|-------|
| GET | `/api/mahasiswa` | Daftar semua mahasiswa | 200 | — |
| GET | `/api/mahasiswa/{id}` | Detail mahasiswa | 200 | 404 |
| POST | `/api/mahasiswa` | Tambah mahasiswa (wajib: `nim`, `nama`, `jurusan`) | 200 | 400 |
| PUT | `/api/mahasiswa/{id}` | Update mahasiswa | 200 | 400, 404 |
| DELETE | `/api/mahasiswa/{id}` | Hapus mahasiswa | 200 | 404 |

### Matakuliah — `/api/matakuliah`

| Method | Path | Deskripsi | Sukses | Gagal |
|--------|------|-----------|--------|-------|
| GET | `/api/matakuliah` | Daftar semua matakuliah | 200 | — |
| GET | `/api/matakuliah/{id}` | Detail matakuliah | 200 | 404 |
| POST | `/api/matakuliah` | Tambah matakuliah (wajib: `kode_mk`, `nama_mk`, `sks`, `semester`; `sks` & `semester` bilangan bulat positif) | 200 | 400 |
| PUT | `/api/matakuliah/{id}` | Update matakuliah | 200 | 400, 404 |
| DELETE | `/api/matakuliah/{id}` | Hapus matakuliah | 200 | 404 |

> `kode_mk` bersifat unik — pengiriman kode yang sudah terdaftar menghasilkan `400`.
> Route dibedakan lewat predikat `request_method` (lihat `pyramid_mahasiswa/routes.py`).

## Pengujian (cURL)

```bash
# Daftar mahasiswa
curl http://localhost:6543/api/mahasiswa

# Detail
curl http://localhost:6543/api/mahasiswa/1

# Tambah
curl -X POST http://localhost:6543/api/mahasiswa \
  -H "Content-Type: application/json" \
  -d '{"nim":"67890","nama":"Ahmad Fadli","jurusan":"Teknik Elektro","tanggal_lahir":"2001-11-05","alamat":"Jl. Mawar No. 10, Surabaya"}'

# Update
curl -X PUT http://localhost:6543/api/mahasiswa/1 \
  -H "Content-Type: application/json" -d '{"jurusan":"Informatika Medis"}'

# Hapus
curl -X DELETE http://localhost:6543/api/mahasiswa/3

# Daftar matakuliah
curl http://localhost:6543/api/matakuliah

# Tambah matakuliah
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF1430","nama_mk":"Keamanan Siber","sks":3,"semester":6}'
```

## Screenshot Pengujian

Seluruh screenshot pengujian tersimpan pada folder [`screenshots/`](screenshots) dan
terembed langsung di bawah ini.

### Endpoint Mahasiswa

**1. `GET /api/mahasiswa` — daftar semua mahasiswa**
![GET /api/mahasiswa](screenshots/01_get_mahasiswa.png)

**2. `GET /api/mahasiswa/1` — detail mahasiswa**
![GET /api/mahasiswa/1](screenshots/02_get_mahasiswa_1.png)

**3. `POST /api/mahasiswa` — tambah mahasiswa (Ahmad Fadli)**
![POST /api/mahasiswa](screenshots/03_post_mahasiswa.png)

**4. `PUT /api/mahasiswa/1` — update mahasiswa**
![PUT /api/mahasiswa/1](screenshots/04_put_mahasiswa.png)

**5. `DELETE /api/mahasiswa/3` — hapus mahasiswa**
![DELETE /api/mahasiswa/3](screenshots/05_delete_mahasiswa.png)

### Endpoint Matakuliah

**6. `GET /api/matakuliah` — daftar semua matakuliah**
![GET /api/matakuliah](screenshots/06_get_matakuliah.png)

**7. `GET /api/matakuliah/1` — detail matakuliah**
![GET /api/matakuliah/1](screenshots/07_get_matakuliah_1.png)

**8. `POST /api/matakuliah` — tambah matakuliah (Keamanan Siber)**
![POST /api/matakuliah](screenshots/08_post_matakuliah.png)

**9. `PUT /api/matakuliah/1` — update matakuliah (sks → 4)**
![PUT /api/matakuliah/1](screenshots/09_put_matakuliah.png)

**10. `DELETE /api/matakuliah/{id}` — hapus matakuliah**
![DELETE /api/matakuliah/{id}](screenshots/10_delete_matakuliah.png)

### Penanganan Error

**11. `POST` tanpa field wajib / `sks` tidak valid → `400 Bad Request`**
![Error 400](screenshots/11_error_400.png)

**12. `GET`/`PUT`/`DELETE` id tidak ditemukan → `404 Not Found`**
![Error 404](screenshots/12_error_404.png)

## Catatan Pengumpulan

- Direktori yang **tidak** ikut di-*commit*: `venv/`, `__pycache__/`, `*.pyc`, `*.sqlite`,
  `*.egg-info/` (lihat `.gitignore`).
- File `development.ini` berisi kredensial database **lokal** untuk keperluan praktikum.
