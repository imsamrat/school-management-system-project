import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let books = [
  { id: 'b1', title: 'Mathematics for Class 10', author: 'R.D. Sharma', isbn: '978-1234567890', publisher: 'Dhanpat Rai', category: 'Textbook', rack_number: 'A1', total_quantity: 10, available_quantity: 8 },
  { id: 'b2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', publisher: 'Scribner', category: 'Literature', rack_number: 'B2', total_quantity: 5, available_quantity: 5 },
];

let issues = [
  { id: 'i1', book_id: 'b1', user_id: 's001', user_type: 'student', issue_date: '2026-10-01', due_date: '2026-10-15', return_date: null, status: 'issued', penalty_amount: 0 },
  { id: 'i2', book_id: 'b1', user_id: 't001', user_type: 'teacher', issue_date: '2026-09-01', due_date: '2026-09-15', return_date: '2026-09-14', status: 'returned', penalty_amount: 0 },
];

// Books
export const getBooks = async (req: Request, res: Response) => {
  return sendSuccess(res, books);
};

export const createBook = async (req: Request, res: Response) => {
  const newBook = { id: `b${books.length + 1}`, available_quantity: req.body.total_quantity, ...req.body };
  books.push(newBook);
  return sendSuccess(res, newBook, 'Book added successfully', 201);
};

// Issues
export const getIssues = async (req: Request, res: Response) => {
  const { status } = req.query;
  const filtered = status ? issues.filter(i => i.status === status) : issues;
  return sendSuccess(res, filtered);
};

export const issueBook = async (req: Request, res: Response) => {
  const { book_id, user_id, user_type, due_date } = req.body;
  
  const bookIndex = books.findIndex(b => b.id === book_id);
  if (bookIndex === -1) return sendError(res, 'Book not found', 404);
  
  if (books[bookIndex].available_quantity <= 0) {
    return sendError(res, 'Book out of stock', 400);
  }

  books[bookIndex].available_quantity -= 1;

  const newIssue = {
    id: `i${issues.length + 1}`,
    book_id,
    user_id,
    user_type,
    issue_date: new Date().toISOString().split('T')[0],
    due_date,
    return_date: null,
    status: 'issued',
    penalty_amount: 0
  };
  issues.push(newIssue);
  
  return sendSuccess(res, newIssue, 'Book issued successfully', 201);
};

export const returnBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { penalty_amount } = req.body;

  const issueIndex = issues.findIndex(i => i.id === id);
  if (issueIndex === -1) return sendError(res, 'Issue record not found', 404);
  
  if (issues[issueIndex].status === 'returned') {
    return sendError(res, 'Book already returned', 400);
  }

  issues[issueIndex].status = 'returned';
  issues[issueIndex].return_date = new Date().toISOString().split('T')[0];
  issues[issueIndex].penalty_amount = penalty_amount || 0;

  const bookIndex = books.findIndex(b => b.id === issues[issueIndex].book_id);
  if (bookIndex > -1) {
    books[bookIndex].available_quantity += 1;
  }

  return sendSuccess(res, issues[issueIndex], 'Book returned successfully');
};
