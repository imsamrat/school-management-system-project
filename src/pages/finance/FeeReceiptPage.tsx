import { useParams, useNavigate } from 'react-router-dom';
import { useGetPaymentsQuery, useGetInvoicesQuery } from '@/features/finance/financeApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { useGetClassesQuery } from '@/features/academics/academicApi';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function FeeReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you'd fetch the specific payment directly by ID. 
  // Here we use the list and find it.
  const { data: paymentsRes, isLoading: isLoadingPay } = useGetPaymentsQuery({});
  const payments = paymentsRes?.data || [];
  const payment = payments.find(p => p.id === id);

  const { data: studentsRes } = useGetStudentsQuery({});
  const students = studentsRes?.data || [];
  const student = payment ? students.find(s => s.id === payment.student_id) : null;

  const { data: classesRes } = useGetClassesQuery();
  const classes = classesRes?.data || [];
  const studentClass = student ? classes.find(c => c.id === student.class_id) : null;

  const { data: invoicesRes } = useGetInvoicesQuery({ student_id: student?.id }, { skip: !student });
  const invoices = invoicesRes?.data || [];
  const invoice = payment ? invoices.find(i => i.id === payment.invoice_id) : null;

  if (isLoadingPay) return <div className="p-10 text-center text-gray-500">Loading receipt...</div>;
  if (!payment) return <div className="p-10 text-center text-red-500">Receipt not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Receipt
        </button>
      </div>

      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0">
        
        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Green Valley School</h2>
            <p className="text-gray-500 mt-1">123 Education Lane, Learning City, 12345</p>
            <p className="text-gray-500">Phone: +1 234 567 8900 | Email: accounts@greenvalley.edu</p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold text-primary-700 uppercase tracking-widest opacity-20 mt-2">Receipt</h1>
            <p className="text-sm font-semibold text-gray-600 mt-2">Receipt No: <span className="text-gray-900">{payment.receipt_number || `RCT-${payment.id.slice(0, 8).toUpperCase()}`}</span></p>
            <p className="text-sm font-semibold text-gray-600">Date: <span className="text-gray-900">{format(new Date(payment.paid_date || payment.created_at || new Date()), 'MMM dd, yyyy')}</span></p>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-gray-50 p-5 rounded-lg mb-8 flex justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Received From</p>
            <p className="font-bold text-lg text-gray-900">{student?.first_name} {student?.last_name}</p>
            <p className="text-gray-600 text-sm">Admn No: {student?.admission_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Class & Section</p>
            <p className="font-semibold text-gray-900">{studentClass?.name}</p>
            <p className="text-gray-600 text-sm">Roll No: {student?.roll_number}</p>
          </div>
        </div>

        {/* Payment Details Table */}
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Description (Invoice)</th>
                <th className="p-4 font-semibold text-gray-700 text-right w-48">Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-gray-200 text-gray-900 font-medium">
                  {invoice?.title || `Payment against Invoice ${payment.invoice_id}`}
                </td>
                <td className="p-4 border-b border-gray-200 text-right font-bold text-gray-900">
                  ${payment.amount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="bg-primary-50 p-4 flex justify-between items-center">
            <span className="font-bold text-primary-900 uppercase tracking-wide">Total Amount Received</span>
            <span className="text-2xl font-bold text-primary-700">${payment.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Meta */}
        <div className="flex gap-12 mb-12">
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
            <p className="font-semibold text-gray-900 capitalize flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {payment.payment_method.replace('_', ' ')}
            </p>
          </div>
          {payment.reference_number && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction / Ref Number</p>
              <p className="font-mono text-gray-900">{payment.reference_number}</p>
            </div>
          )}
        </div>

        {/* Footer / Signatures */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between">
          <div className="text-xs text-gray-500 max-w-sm">
            <p className="font-semibold mb-1">Terms & Conditions</p>
            <p>This is a computer generated receipt and does not require a physical signature. Fees once paid are non-refundable.</p>
          </div>
          <div className="text-center w-48 pt-8 border-t border-gray-400">
            <p className="text-sm font-semibold text-gray-700">Authorized Signatory</p>
          </div>
        </div>

      </div>
    </div>
  );
}
