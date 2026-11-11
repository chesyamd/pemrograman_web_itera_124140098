"""
Berkas: main.py
Deskripsi: Skrip eksekusi untuk menguji seluruh fungsionalitas sistem perpustakaan.
           Menambahkan lima novel (Book) dan satu majalah (Magazine) ke perpustakaan,
           menampilkan katalog, mencari item, serta mendemonstrasikan status
           ketersediaan dan peminjaman.
           Detail (ID, tahun terbit, jumlah halaman / edisi) ditentukan sendiri.
"""

from library_item import Book, Magazine
from library import Library


def main():
    # 1. Buat objek perpustakaan
    perpustakaan = Library("Perpustakaan Kampus ITERA")

    # 2. Buat lima objek Book (menggunakan Inheritance dari LibraryItem)
    # Detail (ID, tahun terbit, jumlah halaman) ditentukan sendiri
    novel1 = Book(
        item_id="B001",
        judul="Harga Sebuah Percaya",
        penulis="Tere Liye",
        tahun_terbit=2014,
        jumlah_halaman=300,
    )

    novel2 = Book(
        item_id="B002",
        judul="Janji",
        penulis="Tere Liye",
        tahun_terbit=2016,
        jumlah_halaman=280,
    )

    novel3 = Book(
        item_id="B003",
        judul="Seperti Dendam Rindu Harus Dibayar Tuntas",
        penulis="Eka Kurniawan",
        tahun_terbit=2014,
        jumlah_halaman=240,
    )

    novel4 = Book(
        item_id="B004",
        judul="Perempuan Patah Hati yang Kembali Menemukan Cinta Melalui Mimpi",
        penulis="Eka Kurniawan",
        tahun_terbit=2021,
        jumlah_halaman=320,
    )

    novel5 = Book(
        item_id="B005",
        judul="Supernova Chapter 3",
        penulis="Dee Lestari",
        tahun_terbit=2003,
        jumlah_halaman=400,
    )

    # 3. Buat satu objek Magazine (menggunakan Inheritance dari LibraryItem)
    # Detail (ID, tahun terbit, edisi, penerbit) ditentukan sendiri
    majalah1 = Magazine(
        item_id="M001",
        judul="National Geographic Indonesia",
        edisi="Edisi 15",
        tahun_terbit=2024,
        penerbit="National Geographic Partners",
    )

    # 4. Tambahkan semua item ke perpustakaan (Encapsulation: via method tambah_item)
    perpustakaan.tambah_item(novel1)
    perpustakaan.tambah_item(novel2)
    perpustakaan.tambah_item(novel3)
    perpustakaan.tambah_item(novel4)
    perpustakaan.tambah_item(novel5)
    perpustakaan.tambah_item(majalah1)

    # 5. Tampilkan katalog awal
    perpustakaan.tampilkan_katalog()

    # 6. Demonstrasi Peminjaman (menggunakan property is_dipinjam dan method pinjam)
    print("\n--- DEMONSTRASI PEMINJAMAN ---")
    novel1.pinjam()        # Novel 1 berhasil dipinjam
    novel1.pinjam()        # Coba pinjam lagi (sudah dipinjam, akan ditolak)

    # 7. Tampilkan katalog setelah peminjaman (lihat perubahan status)
    perpustakaan.tampilkan_katalog()

    # 8. Demonstrasi Pencarian berdasarkan judul
    print("\n--- PENCARIAN BERDASARKAN JUDUL 'supernova' ---")
    hasil_cari = perpustakaan.cari_item("supernova")
    if hasil_cari:
        for item in hasil_cari:
            print(item.get_detail())
    else:
        print("Item tidak ditemukan.")

    # 9. Demonstrasi Pencarian berdasarkan ID
    print("\n--- PENCARIAN BERDASARKAN ID 'M001' ---")
    hasil_cari = perpustakaan.cari_item("M001")
    if hasil_cari:
        for item in hasil_cari:
            print(item.get_detail())
    else:
        print("Item tidak ditemukan.")

    # 10. Demonstrasi Polymorphism: pemanggilan hitung_denda pada berbagai item
    print("\n--- DEMONSTRASI POLYMORPHISM (Hitung Denda 5 Hari) ---")
    daftar_item = perpustakaan.get_koleksi()
    for item in daftar_item:
        # Polymorphism: method hitung_denda memiliki implementasi berbeda per subclass
        denda = item.hitung_denda(5)  # 5 hari keterlambatan
        print(f"{item.get_judul():<60} | Denda 5 hari: Rp {denda:,}")

    # 11. Demonstrasi Pengembalian item
    print("\n--- DEMONSTRASI PENGEMBALIAN ---")
    novel1.kembalikan()

    # 12. Tampilkan katalog akhir
    perpustakaan.tampilkan_katalog()

    # 13. Ringkasan
    print(f"\nTotal item dalam perpustakaan: {perpustakaan.get_jumlah_item()} item")


if __name__ == "__main__":
    main()