import { useState } from 'react';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { useGetCertificatesQuery, useGenerateCertificateMutation } from '@/features/documents/documentsApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { format } from 'date-fns';
import { Printer } from 'lucide-react';
import type { Certificate } from '@/types/documents.types';

export default function CertificatesPage() {
  const { data: studentsRes } = useGetStudentsQuery({});
  const { data: certRes, isLoading } = useGetCertificatesQuery();
  const [generateCertificate, { isLoading: isGenerating }] = useGenerateCertificateMutation();

  const students = studentsRes?.data || [];
  const certificates = certRes?.data || [];

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Certificate>>({
    student_id: '',
    type: 'transfer'
  });

  const handleGenerate = async () => {
    if (!formData.student_id) return;
    try {
      await generateCertificate(formData).unwrap();
      setIsAdding(false);
      setFormData({ student_id: '', type: 'transfer' });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const columns: Column<Certificate>[] = [
    { 
      header: 'Student', 
      cell: row => {
        const s = students.find(s => s.id === row.student_id);
        return s ? <span className="font-semibold text-gray-900">{s.first_name} {s.last_name} ({s.admission_number})</span> : row.student_id;
      }
    },
    { header: 'Type', cell: row => <span className="capitalize font-medium">{row.type} Certificate</span> },
    { header: 'Issue Date', cell: row => format(new Date(row.issue_date), 'MMM dd, yyyy') },
    { 
      header: 'Action', 
      cell: row => (
        <button onClick={handlePrint} className="text-primary-600 hover:text-primary-800 p-2 rounded-md hover:bg-primary-50 transition-colors" title="Print Certificate">
          <Printer className="w-4 h-4" />
        </button>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-sm text-gray-500">Generate leaving and transfer certificates</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
          Generate New Certificate
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Student</label>
              <select 
                value={formData.student_id} 
                onChange={e => setFormData({...formData, student_id: e.target.value})} 
                className="input-field"
              >
                <option value="">Select Student...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Certificate Type</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value as any})} 
                className="input-field"
              >
                <option value="transfer">Transfer Certificate</option>
                <option value="character">Character Certificate</option>
                <option value="leaving">Leaving Certificate</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleGenerate} disabled={isGenerating || !formData.student_id} className="btn-primary">Generate</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 print:hidden">
        <DataTable
          columns={columns}
          data={certificates}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      </div>
      
      {/* Print View Placeholder */}
      <div className="hidden print:block p-10 border-8 border-double border-gray-800 m-8 h-[800px] flex flex-col items-center justify-center space-y-8">
        <h1 className="text-5xl font-serif text-center font-bold">CERTIFICATE OF COMPLETION</h1>
        <p className="text-xl text-center max-w-2xl">This is to certify that the selected student has successfully fulfilled all academic requirements of the institution and bears a good moral character.</p>
        <div className="mt-20 pt-10 border-t border-black w-64 text-center">Principal Signature</div>
      </div>
    </div>
  );
}
