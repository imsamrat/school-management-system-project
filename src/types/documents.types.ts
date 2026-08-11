export interface Certificate {
  id: string;
  student_id: string;
  type: 'transfer' | 'character' | 'leaving';
  issue_date: string;
  status: 'issued';
}
