import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

// Komponen navigasi utama yang selalu ditampilkan di atas halaman
// Props: title (judul aplikasi yang ditampilkan di samping logo buku)
function Navbar({ title }) {
  return (
    <nav className="navbar" aria-label="Navigasi utama">
      <div className="navbar-content">
        {/* Brand: logo buku + judul aplikasi, tautan ke halaman utama */}
        <Link to="/" className="navbar-brand" aria-label="Beranda">
          <span className="brand-icon">📖</span>
          {title}
        </Link>
        {/* Tautan navigasi ke halaman lain */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Beranda
          </Link>
          <Link to="/stats" className="nav-link">
            Statistik
          </Link>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Navbar;
