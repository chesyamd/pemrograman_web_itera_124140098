import { useBooks } from '../context/BookContext';

// Custom hook untuk menghitung statistik koleksi buku dari state global
function useBookStats() {
  const { books } = useBooks();

  // Total jumlah buku tersimpan
  const total = books.length;

  // Hitung buku berdasarkan status masing-masing
  const milik = books.filter((b) => b.status === 'milik').length;
  const baca = books.filter((b) => b.status === 'baca').length;
  const beli = books.filter((b) => b.status === 'beli').length;

  // Asumsi buku dengan status 'baca' dianggap telah selesai dibaca
  const selesai = books.filter((b) => b.status === 'baca').length;

  // Persentase selesai (hindari pembagian nol jika total 0)
  const completionRate = total > 0 ? Math.round((selesai / total) * 100) : 0;

  return {
    total,
    milik,
    baca,
    beli,
    completionRate,
  };
}

export default useBookStats;
