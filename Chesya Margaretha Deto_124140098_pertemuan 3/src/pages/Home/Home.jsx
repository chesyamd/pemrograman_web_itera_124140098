import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import './Home.css';

// Halaman utama aplikasi: menampilkan daftar buku, form tambah, cari, filter, dan edit
function Home() {
  // Akses state global buku dan fungsi CRUD dari Context API
  const { books, addBook, editBook, deleteBook } = useBooks();

  // State filter status (all / milik / baca / beli)
  const [filterStatus, setFilterStatus] = useState('all');
  // State teks pencarian (judul atau penulis)
  const [searchQuery, setSearchQuery] = useState('');
  // State id buku yang sedang diedit (null jika tidak ada)
  const [editingId, setEditingId] = useState(null);
  // State data form edit
  const [editForm, setEditForm] = useState({ title: '', author: '', status: 'milik' });

  // Memfilter daftar buku berdasarkan status dan pencarian judul/penulis (case-insensitive)
  // useMemo agar tidak menghitung ulang render jika dependensi tidak berubah
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchStatus =
        filterStatus === 'all' || book.status === filterStatus;
      const matchSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [books, filterStatus, searchQuery]);

  // Menambahkan buku baru dari form
  const handleAddBook = (newBook) => {
    addBook(newBook);
  };

  // Memulai mode edit: simpan id dan data buku ke form edit
  const startEdit = (book) => {
    setEditingId(book.id);
    setEditForm({ title: book.title, author: book.author, status: book.status });
  };

  // Batal edit dan reset form
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', author: '', status: 'milik' });
  };

  // Simpan perubahan edit dengan validasi sederhana
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.author.trim()) return;
    editBook(editingId, {
      title: editForm.title.trim(),
      author: editForm.author.trim(),
      status: editForm.status,
    });
    cancelEdit();
  };

  // Hapus buku setelah konfirmasi dialog bawaan browser
  const handleDeleteBook = (id) => {
    if (window.confirm('Yakin ingin menghapus buku ini?')) {
      deleteBook(id);
    }
  };

  return (
    <div className="home-page">
      <header className="home-header"></header>

      <BookForm onAddBook={handleAddBook} />

      {/* Kartus pencarian buku berdasarkan judul atau penulis */}
      <div className="search-card">
        <div className="search-header">
          <span className="search-icon">🔍</span>
          <h2 className="search-title">Cari Buku</h2>
        </div>
        <input
          className="input search-input"
          type="text"
          placeholder="Cari berdasarkan judul atau penulis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Cari buku"
        />
      </div>

      {/* Dropdown filter berdasarkan status */}
      <BookFilter status={filterStatus} onFilterChange={setFilterStatus} />

      {/* Tampilkan form edit jika ada buku yang diedit, otherwise tampilkan daftar buku */}
      {editingId ? (
        <div className="edit-card">
          <div className="edit-title">Edit Buku</div>
          <form className="edit-form" onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Judul</label>
              <input
                className="input"
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Penulis</label>
              <input
                className="input"
                type="text"
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="input"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="milik">Milik</option>
                <option value="baca">Baca</option>
                <option value="beli">Beli</option>
              </select>
            </div>
            <div className="edit-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={cancelEdit}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-blue">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      ) : (
        <BookList
          books={filteredBooks}
          onEdit={startEdit}
          onDelete={handleDeleteBook}
        />
      )}
    </div>
  );
}

Home.propTypes = {};

export default Home;
