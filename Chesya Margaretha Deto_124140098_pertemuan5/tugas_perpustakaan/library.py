"""
Berkas: library.py
Deskripsi: Class Library yang menyimpan dan mengelola koleksi item perpustakaan.
           Menerapkan encapsulation dengan atribut private __koleksi.
"""

from library_item import LibraryItem, Book, Magazine


class Library:
    """
    Class Library untuk menyimpan dan mengelola koleksi item perpustakaan.
    Atribut koleksi bersifat private agar data tidak dapat diubah secara sembarangan
    dari luar class.
    """

    def __init__(self, nama_perpustakaan: str):
        """
        Inisialisasi objek Library.

        Args:
            nama_perpustakaan (str): Nama perpustakaan.
        """
        self.nama_perpustakaan = nama_perpustakaan
        # Atribut private (name mangling): hanya dapat diakses melalui method class ini
        self.__koleksi = []

    # -------------------------------------------------------------------------
    # METHOD PENGELOLAN KOLEKSI
    # -------------------------------------------------------------------------
    def tambah_item(self, item: LibraryItem) -> None:
        """
        Menambahkan item baru ke dalam koleksi perpustakaan.

        Args:
            item (LibraryItem): Objek item perpustakaan (Book atau Magazine).
        """
        if not isinstance(item, LibraryItem):
            raise TypeError("Hanya objek turunan LibraryItem yang dapat ditambahkan.")
        self.__koleksi.append(item)
        print(f"Item '{item.get_judul()}' berhasil ditambahkan ke perpustakaan.")

    def tampilkan_katalog(self) -> None:
        """
        Menampilkan seluruh item yang ada dalam koleksi perpustakaan.
        """
        print(f"\n{'='*60}")
        print(f"KATALOG PERPUSTAKAAN: {self.nama_perpustakaan}")
        print(f"{'='*60}")
        if not self.__koleksi:
            print("Koleksi perpustakaan masih kosong.")
        else:
            for idx, item in enumerate(self.__koleksi, start=1):
                print(f"{idx}. {item.get_detail()}")
        print(f"{'='*60}\n")

    def cari_item(self, kunci: str) -> list:
        """
        Mencari item dalam koleksi berdasarkan judul atau ID.

        Args:
            kunci (str): Kata kunci pencarian (judul atau ID item).

        Returns:
            list: Daftar objek LibraryItem yang cocok dengan kunci pencarian.
        """
        hasil = []
        for item in self.__koleksi:
            if kunci.lower() in item.get_judul().lower() or kunci == item.get_id():
                hasil.append(item)
        return hasil

    def get_jumlah_item(self) -> int:
        """
        Mengembalikan jumlah total item dalam koleksi.

        Returns:
            int: Jumlah item perpustakaan.
        """
        return len(self.__koleksi)

    def get_koleksi(self) -> list:
        """
        Mengembalikan salinan daftar koleksi item (readonly).

        Returns:
            list: Salinan daftar objek LibraryItem.
        """
        return self.__koleksi.copy()