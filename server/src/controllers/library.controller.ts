import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { q } = req.query;
    
    let query = supabaseAdmin
        .from('books')
        .select('*')
        .eq('school_id', schoolId);

    if (q && typeof q === 'string') {
        query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,isbn.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch books', 500);
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
        .from('books')
        .insert({ ...req.body, school_id: schoolId })
        .select()
        .single();
        
    if (error) throw error;
    return sendSuccess(res, data, 'Book added successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to add book', 500);
  }
};

export const getIssues = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { status } = req.query;
    
    let query = supabaseAdmin
        .from('book_issues')
        .select('*, books(title, author), students(first_name, last_name, admission_number), staff(first_name, last_name)')
        .eq('school_id', schoolId)
        .order('issue_date', { ascending: false });

    if (status) query = query.eq('status', status);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch book issues', 500);
  }
};

export const issueBook = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { book_id, student_id, staff_id, due_date } = req.body;
    
    // Create issue record
    const { data, error } = await supabaseAdmin
        .from('book_issues')
        .insert({
            school_id: schoolId,
            book_id,
            student_id,
            staff_id,
            due_date,
            issued_by: req.user?.id
        })
        .select()
        .single();
        
    if (error) throw error;
    
    // Decrement available copies
    await supabaseAdmin.rpc('decrement_book_copies', { book_uuid: book_id });
    
    return sendSuccess(res, data, 'Book issued successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to issue book', 500);
  }
};

export const returnBook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data: issue, error: fetchError } = await supabaseAdmin
        .from('book_issues')
        .select('*')
        .eq('id', id)
        .single();
        
    if (fetchError || !issue) return sendError(res, 'Issue record not found', 404);

    const { error } = await supabaseAdmin
        .from('book_issues')
        .update({
            return_date: new Date().toISOString(),
            status: 'returned'
        })
        .eq('id', id);
        
    if (error) throw error;
    
    // Increment available copies
    await supabaseAdmin.rpc('increment_book_copies', { book_uuid: issue.book_id });
    
    return sendSuccess(res, null, 'Book returned successfully');
  } catch (err) {
    return sendError(res, 'Failed to return book', 500);
  }
};
