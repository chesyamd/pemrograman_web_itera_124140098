import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookItem from './BookItem';

// Deteksi otomatis mock function: vi untuk Vite (Vitest), jest untuk CRA
const mockFn = typeof vi !== 'undefined' ? vi.fn : jest.fn;
const clearMocks = typeof vi !== 'undefined' ? vi.clearAllMocks : jest.clearAllMocks;

describe('Komponen BookItem', () => {
  const dummyBook = {
    id: 1,
    title: 'Belajar React Dasar',
    author: 'John Doe',
    status: 'milik',
  };

  const mockEdit = mockFn();
  const mockDelete = mockFn();

  beforeEach(() => {
    clearMocks();
  });

  test('1. merender judul, penulis, dan status buku dengan benar', () => {
    render(<BookItem book={dummyBook} onEdit={mockEdit} onDelete={mockDelete} />);
    expect(screen.getByText('Belajar React Dasar')).toBeInTheDocument();
    expect(screen.getByText('Oleh John Doe')).toBeInTheDocument();
    expect(screen.getByText('Milik')).toBeInTheDocument();
  });

  test('2. memanggil fungsi onEdit saat tombol Edit diklik', () => {
    render(<BookItem book={dummyBook} onEdit={mockEdit} onDelete={mockDelete} />);
    const editBtn = screen.getByText('Edit');
    fireEvent.click(editBtn);
    expect(mockEdit).toHaveBeenCalledWith(dummyBook);
  });

  test('3. memanggil fungsi onDelete saat tombol Hapus diklik', () => {
    render(<BookItem book={dummyBook} onEdit={mockEdit} onDelete={mockDelete} />);
    const deleteBtn = screen.getByText('Hapus');
    fireEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  test('4. menampilkan badge status yang benar untuk tiap status', () => {
    const statuses = [
      { status: 'milik', label: 'Milik' },
      { status: 'baca', label: 'Baca' },
      { status: 'beli', label: 'Beli' },
    ];

    statuses.forEach(({ status, label }) => {
      const book = { ...dummyBook, status };
      render(<BookItem book={book} onEdit={mockEdit} onDelete={mockDelete} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('5. memiliki atribut aria-label pada tombol aksi untuk aksesibilitas', () => {
    render(<BookItem book={dummyBook} onEdit={mockEdit} onDelete={mockDelete} />);
    expect(screen.getByLabelText(`Edit ${dummyBook.title}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Hapus ${dummyBook.title}`)).toBeInTheDocument();
  });
});
