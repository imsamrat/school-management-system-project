import { useState } from 'react';
import { CreditCard, FileText } from 'lucide-react';
import { useGetInvoicesQuery, useCollectPaymentMutation, useGetFeeStructuresQuery, useCreateInvoiceMutation } from '@/features/finance/financeApi';
import { useGetClassesQuery } from '@/features/academics/academicApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import StatusBadge from '@/components/common/StatusBadge';
import { usePermission } from '@/hooks/usePermission';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function StudentFeesPage() {
  const [classId, setClassId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const { data: classesRes } = useGetClassesQuery();
  const { data: studentsRes } = useGetStudentsQuery({});
  const { data: feeStructuresRes } = useGetFeeStructuresQuery({ class_id: classId }, { skip: !classId });
  const { data: invoicesRes } = useGetInvoicesQuery({ student_id: studentId }, { skip: !studentId });
  
  const [createInvoice, { isLoading: isGenerating }] = useCreateInvoiceMutation();
  const [collectPayment, { isLoading: isCollecting }] = useCollectPaymentMutation();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  const classes = classesRes?.data || [];
  const students = (studentsRes?.data || []).filter(s => s.class_id === classId);
  const feeStructures = feeStructuresRes?.data || [];
  const invoices = invoicesRes?.data || [];

  const [paymentData, setPaymentData] = useState<{amount: number, payment_method: 'cash'|'bank_transfer'|'card'|'cheque', reference_number: string}>({ amount: 0, payment_method: 'cash', reference_number: '' });
  
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateData, setGenerateData] = useState<{ fsId: string, amount: number, discount: number, title: string }>({ fsId: '', amount: 0, discount: 0, title: '' });

  const openGenerateModal = (fsId: string, amount: number, name: string) => {
    setGenerateData({ fsId, amount, discount: 0, title: `${name} - ${format(new Date(), 'MMM yyyy')}` });
    setShowGenerateModal(true);
  };

  const handleGenerateInvoice = async () => {
    if (!studentId || !generateData.fsId) return;
    try {
      await createInvoice({
        student_id: studentId,
        fee_structure_id: generateData.fsId,
        amount: generateData.amount,
        discount: generateData.discount,
        due_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') // due in 14 days
      }).unwrap();
      setShowGenerateModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const openCollectModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentData({ amount: invoice.due_amount || invoice.net_amount, payment_method: 'cash', reference_number: '' });
    setShowCollectModal(true);
  };

  const handleCollect = async () => {
    if (!selectedInvoice || paymentData.amount <= 0) return;
    try {
      const res = await collectPayment({
        invoice_id: selectedInvoice.id,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        reference_number: paymentData.reference_number
      }).unwrap();
      
      setShowCollectModal(false);
      // Optional: navigate directly to receipt
      navigate(`/finance/receipts/${res.data.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Fees</h1>
        <p className="text-sm text-gray-500">Manage invoices and collect payments</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-end">
        <div className="w-48">
          <label className="label">Class</label>
          <select value={classId} onChange={e => { setClassId(e.target.value); setStudentId(''); }} className="input-field">
            <option value="">Select Class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="w-64">
          <label className="label">Student</label>
          <select value={studentId} onChange={e => setStudentId(e.target.value)} className="input-field" disabled={!classId}>
            <option value="">Select Student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
          </select>
        </div>
      </div>

      {studentId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Applicable Fees to Generate */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Fees</h2>
            {feeStructures.length === 0 ? (
              <p className="text-sm text-gray-500">No fee structures defined for this class.</p>
            ) : (
              feeStructures.map(fs => (
                <div key={fs.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{fs.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{fs.frequency}</p>
                    </div>
                    <span className="font-semibold text-primary-700">${fs.amount.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => openGenerateModal(fs.id, fs.amount, fs.name)}
                    disabled={isGenerating}
                    className="btn-secondary w-full text-sm py-1.5 mt-2 flex justify-center items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Generate Invoice
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Student Invoices */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Invoices & Ledger</h2>
            {invoices.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                No invoices found for this student.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{inv.fee_structures?.fee_types?.name || inv.invoice_number}</td>
                        <td className="px-4 py-3 text-gray-600">{inv.due_date}</td>
                        <td className="px-4 py-3 font-semibold">
                          ${inv.net_amount?.toFixed(2) || inv.amount?.toFixed(2)}
                          {inv.discount > 0 && <span className="text-xs text-green-600 block">-${inv.discount.toFixed(2)} discount</span>}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                        <td className="px-4 py-3 text-right">
                          {inv.status !== 'paid' && hasPermission('finance.collect') && (
                            <button 
                              onClick={() => openCollectModal(inv)}
                              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 justify-end w-full"
                            >
                              <CreditCard className="w-4 h-4" /> Collect
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Invoice</h2>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Fee Name</p>
              <p className="font-medium text-gray-900">{generateData.title}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Base Amount</label>
                <div className="text-lg font-semibold text-gray-900">${generateData.amount.toFixed(2)}</div>
              </div>
              <div>
                <label className="label">Discount Amount</label>
                <input 
                  type="number" 
                  value={generateData.discount} 
                  onChange={e => setGenerateData({...generateData, discount: Number(e.target.value)})}
                  className="input-field"
                  min="0"
                  max={generateData.amount}
                />
              </div>
              <div>
                <label className="label">Net Amount</label>
                <div className="text-xl font-bold text-primary-700">
                  ${(generateData.amount - generateData.discount).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowGenerateModal(false)} className="btn-secondary">Cancel</button>
              <button 
                onClick={handleGenerateInvoice} 
                disabled={isGenerating || generateData.discount > generateData.amount || generateData.discount < 0}
                className="btn-primary"
              >
                {isGenerating ? 'Generating...' : 'Confirm Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {showCollectModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Collect Payment</h2>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Invoice</p>
                <p className="font-medium text-gray-900">{selectedInvoice.fee_structures?.fee_types?.name || selectedInvoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Due</p>
                <p className="font-bold text-primary-700">${selectedInvoice.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Amount to Collect</label>
                <input 
                  type="number" 
                  value={paymentData.amount} 
                  onChange={e => setPaymentData({...paymentData, amount: Number(e.target.value)})}
                  className="input-field text-lg font-semibold text-gray-900"
                  max={selectedInvoice.amount}
                />
              </div>
              <div>
                <label className="label">Payment Method</label>
                <select 
                  value={paymentData.payment_method} 
                  onChange={e => setPaymentData({...paymentData, payment_method: e.target.value as 'cash'|'bank_transfer'|'card'|'cheque'})}
                  className="input-field"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              {paymentData.payment_method !== 'cash' && (
                <div>
                  <label className="label">Reference / Transaction Number</label>
                  <input 
                    type="text" 
                    value={paymentData.reference_number} 
                    onChange={e => setPaymentData({...paymentData, reference_number: e.target.value})}
                    className="input-field"
                    placeholder="e.g. TXN-987654321"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCollectModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button 
                onClick={handleCollect} 
                disabled={isCollecting || paymentData.amount <= 0 || paymentData.amount > selectedInvoice.amount} 
                className="btn-primary flex-1"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
