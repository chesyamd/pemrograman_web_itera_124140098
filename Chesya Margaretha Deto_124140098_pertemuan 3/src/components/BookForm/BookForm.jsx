import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

// Komponen form untuk menambahkan buku baru ke koleksi
// Menerima prop onAddBook yang dipanggil saat form disubmit dengan data buku baru
function BookForm({ onAddBook }) {
  // State untuk input judul, penulis, dan status buku
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('milik');
  // State untuk menyimpan pesan error validasi tiap field
  const [errors, setErrors] = useState({ title: '', author: '' });

  // Fungsi validasi: judul dan penulis wajib diisi, tidak boleh kosong spasi
  const validate = () => {
    const newErrors = { title: '', author: '' };
    let valid = true;

    if (!title.trim()) {
      newErrors.title = 'Judul wajib diisi';
      valid = false;
    }
    if (!author.trim()) {
      newErrors.author = 'Penulis wajib diisi';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handler saat form disubmit: mencegah refresh, validasi, buat objek buku, kirim ke parent
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newBook = {
      id: Date.now(),                 // ID unik berdasarkan timestamp
      title: title.trim(),
      author: author.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    onAddBook(newBook);               // Kirim data baru ke BookProvider via useBooks()

    // Reset form setelah submit berhasil
    setTitle('');
    setAuthor('');
    setStatus('milik');
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-title">Tambah Buku Baru</div>

      {/* Input Judul dengan validasi error visual */}
      <div className="form-group">
        <label className="form-label">Judul Buku</label>
        <input
          className={`input ${errors.title ? 'error' : ''}`}
          type="text"
          placeholder="Contoh: Belajar React"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <span id="title-error" className="error-text">{errors.title}</span>
        )}
      </div>

      {/* Input Penulis dengan validasi error visual */}
      <div className="form-group">
        <label className="form-label">Penulis</label>
        <input
          className={`input ${errors.author ? 'error' : ''}`}
          type="text"
          placeholder="Contoh: John Doe"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-invalid={!!errors.author}
          aria-describedby={errors.author ? 'author-error' : undefined}
        />
        {errors.author && (
          <span id="author-error" className="error-text">{errors.author}</span>
        )}
      </div>

      {/* Pilihan status: Milik / Baca / Beli dalam bentuk segment button */}
      <div className="form-group">
        <label className="form-label">Status</label>
        <div className="status-segment">
          <button
            type="button"
            className={`status-btn ${status === 'milik' ? 'active' : ''}`}
            onClick={() => setStatus('milik')}
          >
            Milik
          </button>
          <button
            type="button"
            className={`status-btn ${status === 'baca' ? 'active' : ''}`}
            onClick={() => setStatus('baca')}
          >
            Baca
          </button>
          <button
            type="button"
            className={`status-btn ${status === 'beli' ? 'active' : ''}`}
            onClick={() => setStatus('beli')}
          >
            Beli
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-add">
        Simpan Buku
      </button>
    </form>
  );
}

BookForm.propTypes = {
  onAddBook: PropTypes.func.isRequired,
};

export default BookForm;
