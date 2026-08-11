import { format } from 'date-fns';
import { useGetStudentFeesQuery } from '@/features/finance/financeApi';
import { FileText, DollarSign, Calendar, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export function FeesTab({ studentId }: { studentId: string }) {
  const { data: response, isLoading } = useGetStudentFeesQuery(studentId);
  const data = response?.data;
  
  const invoices = data?.invoices || [];
  const payments = data?.payments || [];

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-100 rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Pending Invoices */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" /> Pending Dues
        </h3>
        
        {invoices.filter((i: any) => i.status !== 'paid').length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No pending dues.
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.filter((i: any) => i.status !== 'paid').map((invoice: any) => (
              <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">{invoice.invoice_number}</span>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> {invoice.fee_structures?.name || 'Fee'}
                  </p>
                  {invoice.due_date && (
                    <p className={`text-sm mt-1 flex items-center gap-2 ${new Date(invoice.due_date) < new Date() ? 'text-red-600' : 'text-gray-500'}`}>
                      <Calendar className="w-4 h-4" /> Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-500">Total: ${invoice.net_amount}</p>
                  <p className="text-sm text-green-600">Paid: ${invoice.paid_amount}</p>
                  <p className="text-lg font-bold text-red-600 mt-1">Due: ${invoice.due_amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" /> Payment History
        </h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No payments recorded.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(payment.paid_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      {payment.receipt_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      ${payment.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
