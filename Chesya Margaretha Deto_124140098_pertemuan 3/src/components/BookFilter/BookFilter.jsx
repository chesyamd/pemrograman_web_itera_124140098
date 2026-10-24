import React from 'react';
import PropTypes from 'prop-types';
import './BookFilter.css';

// Komponen dropdown filter untuk menyaring daftar buku berdasarkan status
// Props: status (nilai terpilih saat ini), onFilterChange (callback saat berubah)
function BookFilter({ status, onFilterChange }) {
  // Opsi status yang tersedia
  const options = [
    { value: 'all', label: 'Semua' },
    { value: 'milik', label: 'Milik' },
    { value: 'baca', label: 'Baca' },
    { value: 'beli', label: 'Beli' },
  ];

  return (
    <div className="book-filter">
      <select
        className="filter-select"
        value={status}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter buku berdasarkan status"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

BookFilter.propTypes = {
  status: PropTypes.oneOf(['all', 'milik', 'baca', 'beli']).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default BookFilter;
