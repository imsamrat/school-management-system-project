import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataTable, type Column } from '@/components/common/DataTable';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

const monthlyCollection = [
  { month: 'Jan', collected: 450000, pending: 120000, expense: 180000 },
  { month: 'Feb', collected: 520000, pending: 95000, expense: 195000 },
  { month: 'Mar', collected: 480000, pending: 130000, expense: 210000 },
  { month: 'Apr', collected: 550000, pending: 80000, expense: 220000 },
  { month: 'May', collected: 510000, pending: 110000, expense: 190000 },
  { month: 'Jun', collected: 490000, pending: 100000, expense: 200000 },
  { month: 'Jul', collected: 530000, pending: 90000, expense: 210000 },
  { month: 'Aug', collected: 560000, pending: 75000, expense: 215000 },
];

const feeTypeBreakdown = [
  { id: 'ft1', fee_type: 'Tuition Fee', total_invoiced: 850000, total_collected: 780000, pending: 70000, collection_rate: 91.8 },
  { id: 'ft2', fee_type: 'Exam Fee', total_invoiced: 120000, total_collected: 115000, pending: 5000, collection_rate: 95.8 },
  { id: 'ft3', fee_type: 'Library Fee', total_invoiced: 45000, total_collected: 40000, pending: 5000, collection_rate: 88.9 },
  { id: 'ft4', fee_type: 'Sports Fee', total_invoiced: 60000, total_collected: 50000, pending: 10000, collection_rate: 83.3 },
  { id: 'ft5', fee_type: 'Transport Fee', total_invoiced: 200000, total_collected: 170000, pending: 30000, collection_rate: 85.0 },
];

interface BreakdownRow {
  id: string;
  fee_type: string;
  total_invoiced: number;
  total_collected: number;
  pending: number;
  collection_rate: number;
}

export default function FinanceReportsPage() {
  const [view, setView] = useState<'collection' | 'expense'>('collection');

  const totalCollected = monthlyCollection.reduce((s, m) => s + m.collected, 0);
  const totalPending = monthlyCollection.reduce((s, m) => s + m.pending, 0);
  const totalExpense = monthlyCollection.reduce((s, m) => s + m.expense, 0);
  const netSurplus = totalCollected - totalExpense;

  const columns: Column<BreakdownRow>[] = [
    { header: 'Fee Type', cell: row => <span className="font-semibold text-gray-900">{row.fee_type}</span> },
    { header: 'Invoiced', cell: row => `$${row.total_invoiced.toLocaleString()}` },
    { header: 'Collected', cell: row => <span className="text-green-600 font-bold">${row.total_collected.toLocaleString()}</span> },
    { header: 'Pending', cell: row => <span className="text-red-600 font-semibold">${row.pending.toLocaleString()}</span> },
    { header: 'Collection Rate', cell: row => (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${row.collection_rate >= 90 ? 'bg-green-500' : row.collection_rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${row.collection_rate}%` }}
          />
        </div>
        <span className="text-sm font-bold">{row.collection_rate}%</span>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Reports</h1>
          <p className="text-sm text-gray-500">Financial overview and fee collection analytics</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setView('collection')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'collection' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Collections
          </button>
          <button
            onClick={() => setView('expense')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l ${view === 'expense' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Expenses
          </button>
        </div>
      </div>
      
      {view === 'expense' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex justify-between items-center">
          <p className="text-orange-800 text-sm">You are viewing the expense overview report.</p>
          <a href="/finance/expenses" className="btn-secondary bg-white text-sm">Manage Expenses</a>
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected (YTD)', value: `$${(totalCollected / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Pending', value: `$${(totalPending / 1000).toFixed(0)}K`, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Expenses', value: `$${(totalExpense / 1000).toFixed(0)}K`, icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Net Surplus', value: `$${(netSurplus / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${kpi.color}`}>{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly {view === 'collection' ? 'Fee Collection' : 'Expenses'}</h3>
        <ResponsiveContainer width="100%" height={300}>
          {view === 'collection' ? (
            <AreaChart data={monthlyCollection}>
              <defs>
                <linearGradient id="coll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={v => `$${v}`} />
              <Legend />
              <Area type="monotone" dataKey="collected" stroke="#22c55e" fill="url(#coll)" name="Collected" />
              <Area type="monotone" dataKey="pending" stroke="#ef4444" fill="url(#pend)" name="Pending" />
            </AreaChart>
          ) : (
            <BarChart data={monthlyCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={v => `$${v}`} />
              <Legend />
              <Bar dataKey="expense" fill="#f97316" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Fee Type Breakdown</h2>
        </div>
        <DataTable
          columns={columns}
          data={feeTypeBreakdown}
          keyExtractor={row => row.id}
          isLoading={false}
        />
      </div>
    </div>
  );
}
