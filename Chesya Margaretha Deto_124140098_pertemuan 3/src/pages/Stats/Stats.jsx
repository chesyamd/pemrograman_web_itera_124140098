import React from 'react';
import PropTypes from 'prop-types';
import useBookStats from '../../hooks/useBookStats';
import './Stats.css';

// Halaman statistik: menampilkan ringkasan koleksi buku dan tingkat selesai
function Stats() {
  // Ambil data statistik dari custom hook useBookStats
  const { total, milik, baca, beli, completionRate } = useBookStats();

  return (
    <div className="stats-page">
      <header className="stats-header">
        <p className="stats-subtitle">Koleksi novel pribadi Chesya</p>
      </header>

      {/* Grid 4 kartu statistik: total, milik, baca, beli */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Buku</div>
        </div>

        <div className="stat-card stat-milik">
          <div className="stat-value">{milik}</div>
          <div className="stat-label">Status Milik</div>
        </div>

        <div className="stat-card stat-baca">
          <div className="stat-value">{baca}</div>
          <div className="stat-label">Status Baca</div>
        </div>

        <div className="stat-card stat-beli">
          <div className="stat-value">{beli}</div>
          <div className="stat-label">Status Beli</div>
        </div>
      </div>

      {/* Kartus progres: visual bar + persentase selesai */}
      <div className="progress-card">
        <div className="progress-title">Tingkat Selesai</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="progress-text">{completionRate}% selesai</div>
      </div>

      {/* Pesan kosong jika belum ada data */}
      {total === 0 && (
        <div className="empty-state">
          <p>Belum ada data statistik. Tambahkan buku terlebih dahulu.</p>
        </div>
      )}
    </div>
  );
}

Stats.propTypes = {};

export default Stats;
