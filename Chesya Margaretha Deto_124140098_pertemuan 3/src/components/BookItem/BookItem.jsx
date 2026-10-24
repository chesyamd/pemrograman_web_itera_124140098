import React from 'react';
import PropTypes from 'prop-types';
import './BookItem.css';

// Komponen kartu tunggal untuk menampilkan satu buku beserta aksi edit dan hapus
// Props: book (data buku), onEdit (callback edit), onDelete (callback hapus)
function BookItem({ book, onEdit, onDelete }) {
  // Mapping status ke label dan class CSS badge
  const statusLabels = {
    milik: 'Milik',
    baca: 'Baca',
    beli: 'Beli',
  };

  const statusClasses = {
    milik: 'badge-milik',
    baca: 'badge-baca',
    beli: 'badge-beli',
  };

  return (
    <article className="book-item">
      <div className="book-info">
        {/* Badge status dengan warna sesuai kategori */}
        <span className={`badge ${statusClasses[book.status] || ''}`}>
          {statusLabels[book.status] || book.status}
        </span>
        <div className="book-title">{book.title}</div>
        <div className="book-author">Oleh {book.author}</div>
      </div>

      <div className="book-actions">
        {/* Tombol Edit: memanggil onEdit dengan data buku lengkap */}
        <button
          type="button"
          className="btn btn-edit"
          onClick={() => onEdit(book)}
          aria-label={`Edit ${book.title}`}
        >
          Edit
        </button>
        {/* Tombol Hapus: memanggil onDelete dengan id buku */}
        <button
          type="button"
          className="btn btn-delete"
          onClick={() => onDelete(book.id)}
          aria-label={`Hapus ${book.title}`}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookItem;
