import { useState } from 'react';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { Printer } from 'lucide-react';

export default function IdCardsPage() {
  const { data: studentsRes, isLoading } = useGetStudentsQuery({});
  const students = studentsRes?.data || [];

  const [selectedClass, setSelectedClass] = useState('');
  
  const filteredStudents = selectedClass ? students.filter(s => s.class_id === selectedClass) : students;

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ID Cards Generation</h1>
          <p className="text-sm text-gray-500">Generate and print ID cards for students</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="input-field max-w-[200px]"
          >
            <option value="">All Classes</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 10">Class 10</option>
          </select>
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print ID Cards
          </button>
        </div>
      </div>

      {/* Print View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-2 print:gap-4">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white border-2 border-primary-600 rounded-xl overflow-hidden shadow-sm flex flex-col print:break-inside-avoid print:shadow-none h-[350px]">
            <div className="bg-primary-600 text-white p-3 text-center">
              <h3 className="font-bold text-lg leading-tight">Green Valley School</h3>
              <p className="text-[10px] opacity-80">123 Education Lane, NY</p>
            </div>
            
            <div className="flex-1 p-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden mb-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${student.first_name}+${student.last_name}&background=f3f4f6&color=4b5563&size=200`} 
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center uppercase mb-1">{student.first_name} {student.last_name}</h2>
              <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-0.5 rounded-full mb-3">STUDENT</span>
              
              <div className="w-full text-sm space-y-1.5 flex-1">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium text-xs">ID No:</span>
                  <span className="font-bold">{student.admission_number}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium text-xs">Class:</span>
                  <span className="font-bold">{student.class_id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium text-xs">Gender:</span>
                  <span className="font-bold">{student.gender}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 text-center border-t border-gray-200">
              <p className="text-[9px] text-gray-500">If found, please return to school office.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
