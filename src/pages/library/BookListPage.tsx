import { useState } from 'react';
import { Book as BookIcon, Plus } from 'lucide-react';
import { useGetBooksQuery, useCreateBookMutation } from '@/features/library/libraryApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { Book } from '@/types/library.types';

export default function BookListPage() {
  const { data: response, isLoading } = useGetBooksQuery();
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '', author: '', isbn: '', publisher: '', category: '', rack_number: '', total_quantity: 1
  });

  const books = response?.data || [];

  const handleAdd = async () => {
    if (!newBook.title || !newBook.author || !newBook.total_quantity) return;
    try {
      await createBook(newBook).unwrap();
      setIsAdding(false);
      setNewBook({ title: '', author: '', isbn: '', publisher: '', category: '', rack_number: '', total_quantity: 1 });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Book>[] = [
    { header: 'Title', cell: row => <span className="font-semibold text-gray-900">{row.title}</span> },
    { header: 'Author', accessorKey: 'author' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Rack No.', accessorKey: 'rack_number' },
    { 
      header: 'Available', 
      cell: row => (
        <span className={`font-semibold ${row.available_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {row.available_quantity} / {row.total_quantity}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Inventory</h1>
          <p className="text-sm text-gray-500">Manage school library books</p>
        </div>
        {hasPermission('library.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Book
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="label">Title</label>
              <input type="text" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="input-field" placeholder="e.g. Advanced Physics" />
            </div>
            <div>
              <label className="label">Author</label>
              <input type="text" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Category</label>
              <input type="text" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="input-field" placeholder="e.g. Science" />
            </div>
            <div>
              <label className="label">ISBN</label>
              <input type="text" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Publisher</label>
              <input type="text" value={newBook.publisher} onChange={e => setNewBook({...newBook, publisher: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Rack No.</label>
              <input type="text" value={newBook.rack_number} onChange={e => setNewBook({...newBook, rack_number: e.target.value})} className="input-field" placeholder="e.g. A1-4" />
            </div>
            <div>
              <label className="label">Total Quantity</label>
              <input type="number" value={newBook.total_quantity} onChange={e => setNewBook({...newBook, total_quantity: Number(e.target.value)})} className="input-field" min="1" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={isCreating || !newBook.title || !newBook.author} className="btn-primary">Save Book</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={books}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
