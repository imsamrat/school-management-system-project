import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/features/admissions/admissionsApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import type { AdmissionApplication } from '@/types/admissions.types';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ApplicationsPage() {
  const { data: appRes, isLoading } = useGetApplicationsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

  const applications = appRes?.data || [];

  const handleUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<AdmissionApplication>[] = [
    { header: 'Applicant Name', cell: row => <span className="font-semibold text-gray-900">{row.first_name} {row.last_name}</span> },
    { header: 'Applied For', accessorKey: 'applied_class' },
    { header: 'Applied Date', cell: row => format(new Date(row.applied_date), 'MMM dd, yyyy') },
    { header: 'Contact', cell: row => <span className="text-sm">{row.email}</span> },
    { header: 'Status', cell: row => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: row => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <>
              <button 
                onClick={() => handleUpdate(row.id, 'approved')} 
                disabled={isUpdating}
                className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg"
                title="Approve"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleUpdate(row.id, 'rejected')} 
                disabled={isUpdating}
                className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"
                title="Reject"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Applications</h1>
          <p className="text-sm text-gray-500">Review and manage student admission requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={applications}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
