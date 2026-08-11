import { useState } from 'react';
import { Save, DollarSign, Percent, Calendar, CreditCard } from 'lucide-react';

interface FeeSettings {
  currency: string;
  currency_symbol: string;
  late_fee_enabled: boolean;
  late_fee_amount: number;
  late_fee_type: 'fixed' | 'percentage';
  grace_period_days: number;
  invoice_prefix: string;
  payment_methods: string[];
  auto_generate_invoices: boolean;
  invoice_due_days: number;
}

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Mobile Banking'];

export default function FeeSettingsPage() {
  const [formData, setFormData] = useState<FeeSettings>({
    currency: 'USD',
    currency_symbol: '$',
    late_fee_enabled: true,
    late_fee_amount: 50,
    late_fee_type: 'fixed',
    grace_period_days: 5,
    invoice_prefix: 'INV',
    payment_methods: ['Cash', 'Card', 'Bank Transfer'],
    auto_generate_invoices: true,
    invoice_due_days: 15,
  });
  const [saved, setSaved] = useState(false);

  const togglePaymentMethod = (method: string) => {
    const methods = formData.payment_methods.includes(method)
      ? formData.payment_methods.filter(m => m !== method)
      : [...formData.payment_methods, method];
    setFormData({ ...formData, payment_methods: methods });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Settings</h1>
        <p className="text-sm text-gray-500">Configure payment policies, late fees, and invoice preferences</p>
      </div>

      {/* Currency & Invoice */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Currency & Invoicing</h2>
            <p className="text-xs text-gray-500">Set how fees are displayed and invoiced</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Currency Code</label>
            <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="input-field">
              <option value="USD">USD — US Dollar</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="EUR">EUR — Euro</option>
              <option value="BDT">BDT — Bangladeshi Taka</option>
              <option value="INR">INR — Indian Rupee</option>
              <option value="PKR">PKR — Pakistani Rupee</option>
            </select>
          </div>
          <div>
            <label className="label">Currency Symbol</label>
            <input type="text" maxLength={3} value={formData.currency_symbol} onChange={e => setFormData({ ...formData, currency_symbol: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Invoice Prefix</label>
            <input type="text" value={formData.invoice_prefix} onChange={e => setFormData({ ...formData, invoice_prefix: e.target.value })} className="input-field" placeholder="e.g. INV, SCHOOL" />
            <p className="text-xs text-gray-400 mt-1">Invoices will be named e.g. {formData.invoice_prefix}-0001</p>
          </div>
          <div>
            <label className="label">Invoice Due After (days)</label>
            <input type="number" min="1" max="60" value={formData.invoice_due_days} onChange={e => setFormData({ ...formData, invoice_due_days: +e.target.value })} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setFormData({ ...formData, auto_generate_invoices: !formData.auto_generate_invoices })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${formData.auto_generate_invoices ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.auto_generate_invoices ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Auto-generate Invoices</span>
                <p className="text-xs text-gray-500">Automatically create invoices at the start of each billing cycle</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Late Fee Policy */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Late Fee Policy</h2>
            <p className="text-xs text-gray-500">Define penalties for overdue payments</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFormData({ ...formData, late_fee_enabled: !formData.late_fee_enabled })}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${formData.late_fee_enabled ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.late_fee_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-gray-900">Enable Late Fee Charges</span>
          </label>

          {formData.late_fee_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="label">Grace Period (days)</label>
                <input type="number" min="0" max="30" value={formData.grace_period_days} onChange={e => setFormData({ ...formData, grace_period_days: +e.target.value })} className="input-field" />
                <p className="text-xs text-gray-400 mt-1">Days allowed after due date before late fee applies</p>
              </div>
              <div>
                <label className="label">Late Fee Type</label>
                <select value={formData.late_fee_type} onChange={e => setFormData({ ...formData, late_fee_type: e.target.value as any })} className="input-field">
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage of Invoice</option>
                </select>
              </div>
              <div>
                <label className="label">{formData.late_fee_type === 'fixed' ? `Amount (${formData.currency_symbol})` : 'Percentage (%)'}</label>
                <input type="number" min="0" value={formData.late_fee_amount} onChange={e => setFormData({ ...formData, late_fee_amount: +e.target.value })} className="input-field" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Accepted Payment Methods</h2>
            <p className="text-xs text-gray-500">Select which payment methods are available to parents</p>
          </div>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          {PAYMENT_METHODS.map(method => {
            const selected = formData.payment_methods.includes(method);
            return (
              <button
                key={method}
                type="button"
                onClick={() => togglePaymentMethod(method)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  selected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
