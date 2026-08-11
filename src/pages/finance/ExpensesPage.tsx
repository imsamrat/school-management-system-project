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
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  
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
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Expense
        </button>
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

      <ConfirmDialog
        isOpen={!!expenseToDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setExpenseToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
