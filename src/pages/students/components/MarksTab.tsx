import { format } from 'date-fns';
import { useGetStudentMarksQuery } from '@/features/exams/examApi';
import { BookOpen, GraduationCap } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export function MarksTab({ studentId }: { studentId: string }) {
  const { data: response, isLoading } = useGetStudentMarksQuery(studentId);
  const marks = response?.data || [];

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-100 rounded-xl"></div>
    </div>;
  }

  // Group marks by exam
  const marksByExam = marks.reduce((acc: any, mark: any) => {
    const examId = mark.exam_subjects?.exams?.name || 'Unknown Exam';
    if (!acc[examId]) {
      acc[examId] = [];
    }
    acc[examId].push(mark);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>

      {marks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No exam marks recorded yet.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(marksByExam).map(([examName, examMarks]: [string, any]) => (
            <div key={examName} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-gray-900">{examName}</h4>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {examMarks.map((mark: any) => {
                    const subjectName = mark.exam_subjects?.subjects?.name || 'Unknown Subject';
                    const totalMarks = mark.exam_subjects?.total_marks || 100;
                    const passMarks = mark.exam_subjects?.pass_marks || 33;
                    const obtained = parseFloat(mark.written_marks || 0) + parseFloat(mark.practical_marks || 0);
                    const isPass = obtained >= passMarks;

                    return (
                      <tr key={mark.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          {subjectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {totalMarks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {obtained}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isPass ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {mark.remarks || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
