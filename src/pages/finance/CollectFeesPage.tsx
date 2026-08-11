import { useState } from 'react';
import { useGetInvoicesQuery, useCollectPaymentMutation } from '@/features/finance/financeApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import { CreditCard, Search, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CollectFeesPage() {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({ amount: 0, payment_method: 'cash' as const, reference_number: '' });

  const { data: studentsRes } = useGetStudentsQuery({});
  const { data: invoicesRes, isLoading } = useGetInvoicesQuery({ student_id: selectedStudentId }, { skip: !selectedStudentId });
  const [collectPayment, { isLoading: isCollecting }] = useCollectPaymentMutation();
  const navigate = useNavigate();

  const students = studentsRes?.data || [];
  const invoices = invoicesRes?.data || [];

  const filteredStudents = studentSearch.length >= 2
    ? students.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.admission_number.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : [];

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const pendingInvoices = invoices.filter(inv => inv.status !== 'paid');
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + (inv.due_amount || inv.net_amount || inv.amount), 0);

  const openCollect = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentData({ amount: invoice.due_amount || invoice.net_amount || invoice.amount, payment_method: 'cash', reference_number: '' });
    setShowModal(true);
  };

  const handleCollect = async () => {
    if (!selectedInvoice) return;
    try {
      await collectPayment({
        invoice_id: selectedInvoice.id,
        student_id: selectedInvoice.student_id,
        ...paymentData
      }).unwrap();
      setShowModal(false);
      setSelectedInvoice(null);
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<any>[] = [
    { header: 'Title', cell: row => <span className="font-semibold text-gray-900">{row.fee_structures?.fee_types?.name || row.invoice_number}</span> },
    { header: 'Amount', cell: row => (
      <div>
        <span className="font-bold">${(row.net_amount || row.amount).toFixed(2)}</span>
        {row.discount > 0 && <span className="text-xs text-green-600 block">-${row.discount.toFixed(2)} discount</span>}
      </div>
    )},
    { header: 'Due Date', cell: row => format(new Date(row.due_date), 'MMM dd, yyyy') },
    { header: 'Status', cell: row => <StatusBadge status={row.status} /> },
    { header: 'Action', cell: row => (
      <div className="flex items-center gap-2">
        {row.status !== 'paid' && (
          <button
            onClick={() => openCollect(row)}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <CreditCard className="w-4 h-4" /> Collect
          </button>
        )}
        {row.status === 'paid' && (
          <button
            onClick={() => navigate(`/finance/receipts/${row.id}`)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Receipt className="w-4 h-4" /> Receipt
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Collect Fees</h1>
        <p className="text-sm text-gray-500">Search for a student and collect pending fee payments</p>
      </div>

      {/* Student Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <label className="label">Search Student</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-9"
            placeholder="Search by name or admission number..."
            value={studentSearch}
            onChange={e => {
              setStudentSearch(e.target.value);
              setSelectedStudentId('');
            }}
          />
        </div>

        {filteredStudents.length > 0 && !selectedStudentId && (
          <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {filteredStudents.slice(0, 6).map(s => (
              <button
                key={s.id}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between transition-colors"
                onClick={() => {
                  setSelectedStudentId(s.id);
                  setStudentSearch(`${s.first_name} ${s.last_name}`);
                }}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.first_name} {s.last_name}</p>
                  <p className="text-xs text-gray-500">{s.admission_number} — {s.class_id}</p>
                </div>
                <span className="text-xs text-primary-600 font-medium">Select →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Student Fee Summary */}
      {selectedStudentId && selectedStudent && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm col-span-2">
              <p className="text-sm font-medium text-gray-500">Selected Student</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{selectedStudent.first_name} {selectedStudent.last_name}</p>
              <p className="text-sm text-gray-500">{selectedStudent.admission_number}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-200 shadow-sm">
              <p className="text-sm font-medium text-red-600">Total Pending</p>
              <p className="text-3xl font-bold text-red-700 mt-1">${totalPending.toFixed(2)}</p>
              <p className="text-xs text-red-500 mt-1">{pendingInvoices.length} pending invoices</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Fee Invoices</h2>
            </div>
            <DataTable
              columns={columns}
              data={invoices}
              keyExtractor={row => row.id}
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Collect Payment</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p className="text-sm text-gray-500">Invoice: <span className="font-semibold text-gray-900">{selectedInvoice.fee_structures?.fee_types?.name || selectedInvoice.invoice_number}</span></p>
              <p className="text-sm text-gray-500">Amount Due: <span className="font-bold text-red-600">${(selectedInvoice.due_amount || selectedInvoice.net_amount || selectedInvoice.amount).toFixed(2)}</span></p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Amount to Collect ($)</label>
                <input type="number" value={paymentData.amount} onChange={e => setPaymentData({ ...paymentData, amount: Number(e.target.value) })} className="input-field" min="0" max={selectedInvoice.due_amount || selectedInvoice.net_amount || selectedInvoice.amount} />
              </div>
              <div>
                <label className="label">Payment Method</label>
                <select value={paymentData.payment_method} onChange={e => setPaymentData({ ...paymentData, payment_method: e.target.value as any })} className="input-field">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile_banking">Mobile Banking</option>
                  <option value="other">Cheque / Other</option>
                </select>
              </div>
              <div>
                <label className="label">Reference / Transaction No. (Optional)</label>
                <input type="text" value={paymentData.reference_number} onChange={e => setPaymentData({ ...paymentData, reference_number: e.target.value })} className="input-field" placeholder="e.g. TXN123456" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCollect} disabled={isCollecting || !paymentData.amount} className="btn-primary">
                {isCollecting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
