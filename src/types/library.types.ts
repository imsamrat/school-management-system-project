export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  category: string;
  rack_number: string;
  total_quantity: number;
  available_quantity: number;
}

export interface BookIssue {
  id: string;
  book_id: string;
  user_id: string;
  user_type: 'student' | 'teacher';
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: 'issued' | 'returned';
  penalty_amount: number;
}
