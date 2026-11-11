"""
Berkas: library_item.py
Deskripsi: Abstract class LibraryItem(ABC) beserta subclass Book dan Magazine.
           Menerapkan abstract method, property decorator, dan encapsulation.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract Base Class yang menjadi dasar untuk semua item di perpustakaan.
    Tidak dapat diinstansiasi secara langsung (harus melalui subclass konkrit).
    """

    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        """
        Inisialisasi atribut dasar setiap item perpustakaan.

        Args:
            item_id (str): ID unik item perpustakaan.
            judul (str): Judul item.
            tahun_terbit (int): Tahun terbit item.
        """
        # Atribut terlindungi (protected): diakses dari dalam class dan subclass
        self._item_id = item_id
        self._judul = judul
        self._tahun_terbit = tahun_terbit

        # Atribut private (name mangling): status peminjaman tidak boleh diubah sembarangan
        self.__is_dipinjam = False

    # -------------------------------------------------------------------------
    # ABSTRACT METHOD: wajib diimplementasikan oleh setiap subclass konkrit
    # -------------------------------------------------------------------------
    @abstractmethod
    def hitung_denda(self, terlambat_hari: int) -> float:
        """
        Menghitung denda keterlambatan pengembalian item.

        Args:
            terlambat_hari (int): Jumlah hari keterlambatan.

        Returns:
            float: Nominal denda dalam rupiah.
        """
        pass

    @abstractmethod
    def get_detail(self) -> str:
        """
        Mengembalikan representasi detail lengkap item dalam bentuk string.

        Returns:
            str: Detail item perpustakaan.
        """
        pass

    # -------------------------------------------------------------------------
    # PROPERTY DECORATOR: getter untuk status ketersediaan item
    # -------------------------------------------------------------------------
    @property
    def is_dipinjam(self) -> bool:
        """
        Mengembalikan status apakah item sedang dipinjam atau tidak.

        Returns:
            bool: True jika sedang dipinjam, False jika tersedia.
        """
        return self.__is_dipinjam

    @is_dipinjam.setter
    def is_dipinjam(self, status: bool) -> None:
        """
        Mengubah status peminjaman item dengan validasi tipe data.

        Args:
            status (bool): Status peminjaman baru.
        """
        if not isinstance(status, bool):
            raise TypeError("Status peminjaman harus berupa boolean (True/False).")
        self.__is_dipinjam = status

    # -------------------------------------------------------------------------
    # METHOD KONKRET: dapat digunakan langsung oleh semua subclass
    # -------------------------------------------------------------------------
    def pinjam(self) -> bool:
        """
        Menandai item sebagai dipinjam jika belum dipinjam oleh orang lain.

        Returns:
            bool: True jika berhasil dipinjam, False jika sudah dipinjam.
        """
        if self.__is_dipinjam:
            print(f"Item '{self._judul}' sudah sedang dipinjam.")
            return False
        self.__is_dipinjam = True
        print(f"Item '{self._judul}' berhasil dipinjam.")
        return True

    def kembalikan(self) -> None:
        """
        Mengembalikan item ke perpustakaan (menandai sebagai tersedia).
        """
        self.__is_dipinjam = False
        print(f"Item '{self._judul}' telah dikembalikan.")

    def get_id(self) -> str:
        """Mengembalikan ID item."""
        return self._item_id

    def get_judul(self) -> str:
        """Mengembalikan judul item."""
        return self._judul


class Book(LibraryItem):
    """
    Subclass Book merepresentasikan buku di perpustakaan.
    Mewarisi LibraryItem dan mengimplementasikan semua abstract method.
    """

    def __init__(self, item_id: str, judul: str, penulis: str,
                 tahun_terbit: int, jumlah_halaman: int):
        """
        Inisialisasi objek Book.

        Args:
            item_id (str): ID unik buku.
            judul (str): Judul buku.
            penulis (str): Nama penulis buku.
            tahun_terbit (int): Tahun terbit buku.
            jumlah_halaman (int): Jumlah halaman buku.
        """
        super().__init__(item_id, judul, tahun_terbit)
        # Atribut spesifik Book
        self._penulis = penulis
        self._jumlah_halaman = jumlah_halaman

    def hitung_denda(self, terlambat_hari: int) -> float:
        """
        Menghitung denda keterlambatan untuk buku.
        Tarif: Rp 1.000 per hari.

        Args:
            terlambat_hari (int): Jumlah hari keterlambatan.

        Returns:
            float: Nominal denda dalam rupiah.
        """
        return terlambat_hari * 1000

    def get_detail(self) -> str:
        """
        Mengembalikan detail lengkap buku.

        Returns:
            str: Detail buku termasuk penulis dan jumlah halaman.
        """
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[BUKU] ID: {self._item_id} | Judul: {self._judul} | "
            f"Penulis: {self._penulis} | Tahun: {self._tahun_terbit} | "
            f"Halaman: {self._jumlah_halaman} | Status: {status}"
        )


class Magazine(LibraryItem):
    """
    Subclass Magazine merepresentasikan majalah di perpustakaan.
    Mewarisi LibraryItem dan mengimplementasikan semua abstract method.
    """

    def __init__(self, item_id: str, judul: str, edisi: str,
                 tahun_terbit: int, penerbit: str):
        """
        Inisialisasi objek Magazine.

        Args:
            item_id (str): ID unik majalah.
            judul (str): Judul majalah.
            edisi (str): Nomor edisi majalah.
            tahun_terbit (int): Tahun terbit majalah.
            penerbit (str): Nama penerbit majalah.
        """
        super().__init__(item_id, judul, tahun_terbit)
        # Atribut spesifik Magazine
        self._edisi = edisi
        self._penerbit = penerbit

    def hitung_denda(self, terlambat_hari: int) -> float:
        """
        Menghitung denda keterlambatan untuk majalah.
        Tarif: Rp 500 per hari.

        Args:
            terlambat_hari (int): Jumlah hari keterlambatan.

        Returns:
            float: Nominal denda dalam rupiah.
        """
        return terlambat_hari * 500

    def get_detail(self) -> str:
        """
        Mengembalikan detail lengkap majalah.

        Returns:
            str: Detail majalah termasuk edisi dan penerbit.
        """
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[MAJALAH] ID: {self._item_id} | Judul: {self._judul} | "
            f"Edisi: {self._edisi} | Tahun: {self._tahun_terbit} | "
            f"Penerbit: {self._penerbit} | Status: {status}"
        )