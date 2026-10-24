import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Membuat wadah Context React untuk state global buku
const BookContext = createContext();

// Custom hook untuk mengakses state global buku dari komponen mana saja
// Akan melempar error jika digunakan di luar <BookProvider>
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider');
  }
  return context;
}

// Provider yang menyimpan dan mengelola state global daftar buku
export function BookProvider({ children }) {
  // Ambil data buku dari localStorage (persisten meski refresh halaman)
  const [books, setBooks] = useLocalStorage('books_data', []);

  // Fungsi menambah buku baru ke akhir array (immutability via spread operator)
  const addBook = useCallback((newBook) => {
    setBooks((prev) => [...prev, newBook]);
  }, [setBooks]);

  // Fungsi mengedit buku berdasarkan id, menggabungkan data lama dengan baru
  const editBook = useCallback((id, updatedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBook } : b))
    );
  }, [setBooks]);

  // Fungsi menghapus buku berdasarkan id dengan filter array
  const deleteBook = useCallback((id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, [setBooks]);

  // Menghitung statistik koleksi buku dari state saat ini
  const stats = {
    total: books.length,
    milik: books.filter((b) => b.status === 'milik').length,
    baca: books.filter((b) => b.status === 'baca').length,
    beli: books.filter((b) => b.status === 'beli').length,
  };

  // Nilai yang akan dibagikan ke seluruh komponen anak melalui Context
  const value = {
    books,
    addBook,
    editBook,
    deleteBook,
    stats,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}
