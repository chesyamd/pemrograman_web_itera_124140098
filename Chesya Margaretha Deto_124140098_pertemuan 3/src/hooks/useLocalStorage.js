import { useState, useEffect } from 'react';

// Custom hook untuk menyimpan dan membaca data dari localStorage secara otomatis
// Dipakai untuk penyimpanan persisten data buku (tetap tersimpan meski browser ditutup)
function useLocalStorage(key, initialValue) {
  // Inisialisasi state dengan nilai dari localStorage, atau initialValue jika kosong/error
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Setiap storedValue berubah, tulis ulang ke localStorage (sinkronisasi otomatis)
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  // Mengembalikan [nilai, fungsiUpdate] mirip useState
  return [storedValue, setStoredValue];
}

export default useLocalStorage;
