import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { 
  useGetExpensesQuery, 
  useGetExpenseCategoriesQuery, 
  useCreateExpenseMutation,
  useDeleteExpenseMutation
} from '@/features/finance/expenseApi';
import type { Expense } from '@/types/finance.types';

export default function ExpensesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    amount: '',
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
  });

  const { data: expensesRes, isLoading: isLoadingExpenses } = useGetExpensesQuery({});
  const { data: categoriesRes } = useGetExpenseCategoriesQuery();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateExpenseCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteExpenseCategoryMutation();

  const expenses = expensesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense({
        title: formData.title,
        category_id: formData.category_id,
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        description: formData.description,
      }).unwrap();
      
      setShowAddModal(false);
      setFormData({
        title: '',
        category_id: '',
        amount: '',
        expense_date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
      });
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete).unwrap();
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName.trim() }).unwrap();
      setNewCategoryName('');
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category. It might already exist.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Cannot delete category that is in use by expenses.');
      setCategoryToDelete(null);
    }
  };

  const columns: Column<Expense>[] = [
    { header: 'Date', cell: row => format(new Date(row.expense_date), 'MMM dd, yyyy') },
    { header: 'Title', cell: row => <span className="font-semibold text-gray-900">{row.title}</span> },
    { header: 'Category', cell: row => <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">{row.category_name}</span> },
    { header: 'Amount', cell: row => <span className="font-bold text-red-600">${row.amount.toFixed(2)}</span> },
    { header: 'Description', cell: row => <span className="text-gray-500 text-sm truncate max-w-[200px] inline-block">{row.description || '-'}</span> },
    {
      header: 'Action',
      cell: row => (
        <button 
          onClick={() => setExpenseToDelete(row.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
          title="Delete Expense"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500">Record and manage school expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCategoryModal(true)} className="btn-secondary flex items-center gap-2">
            Manage Categories
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Record Expense
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={expenses}
          keyExtractor={(row) => row.id}
          isLoading={isLoadingExpenses}
        />
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Record New Expense</h2>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="e.g. Electric Bill" />
              </div>
              
              <div>
                <label className="label">Category *</label>
                <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="input-field">
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Amount ($) *</label>
                <input required type="number" step="0.01" min="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="input-field" />
              </div>

              <div>
                <label className="label">Date *</label>
                <input required type="date" value={formData.expense_date} onChange={e => setFormData({...formData, expense_date: e.target.value})} className="input-field" />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" rows={3} placeholder="Optional details..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isCreating} className="btn-primary">
                  {isCreating ? 'Saving...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input required type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="input-field flex-1" placeholder="New Category Name..." />
              <button type="submit" disabled={isCreatingCategory} className="btn-primary whitespace-nowrap">Add</button>
            </form>

            <div className="flex-1 overflow-y-auto min-h-[200px]">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No categories added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map(c => (
                    <li key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="font-medium text-gray-700">{c.name}</span>
                      <button 
                        onClick={() => setCategoryToDelete(c.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!expenseToDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setExpenseToDelete(null)}
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? You cannot delete categories that are already in use by existing expenses."
        onConfirm={handleDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
        isLoading={isDeletingCategory}
      />
    </div>
  );
}
