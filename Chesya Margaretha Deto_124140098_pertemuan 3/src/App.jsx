import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import NotFound from './components/NotFound/NotFound';
import './App.css';

// App adalah komponen root aplikasi.
// Struktur:
// 1. <Router>      : menyediakan konteks navigasi berbasis HTML5 History API (SPA)
// 2. <BookProvider>: menyediakan state global (daftar buku) ke seluruh komponen melalui Context API
// 3. <Navbar>      : navigasi utama selalu ditampilkan di atas halaman
// 4. <Routes>      : mencocokkan URL path dan merender halaman yang sesuai
function App() {
  return (
    <Router>
      <BookProvider>
        <div className="app">
          <Navbar title="Chesya's Library" />
          <main className="page-container">
            <Routes>
              {/* Halaman utama: daftar buku, tambah, edit, hapus, cari, filter */}
              <Route path="/" element={<Home />} />
              {/* Halaman statistik: ringkasan koleksi buku */}
              <Route path="/stats" element={<Stats />} />
              {/* Halaman 404 jika URL tidak cocok dengan rute di atas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BookProvider>
    </Router>
  );
}

export default App;
