import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-icon">📭</div>
      <h1 className="not-found-title">Halaman tidak ditemukan</h1>
      <p className="not-found-desc">
        Halaman yang Anda cari tidak tersedia.
      </p>
      <Link to="/" className="btn btn-blue not-found-btn">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFound;
