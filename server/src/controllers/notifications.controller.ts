import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

let notifications = [
  { id: 'notif1', user_id: 'admin', title: 'New Admission Request', message: 'Jane Doe submitted a new application for Class 5.', type: 'info', is_read: false, created_at: new Date().toISOString() },
  { id: 'notif2', user_id: 'admin', title: 'System Update', message: 'The ERP will undergo maintenance at 2 AM.', type: 'warning', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'notif3', user_id: 'admin', title: 'Fee Payment Received', message: 'Received $500 for Tuition Fee.', type: 'success', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export const getNotifications = async (req: Request, res: Response) => {
  // In a real app, filter by req.user.id
  return sendSuccess(res, notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.is_read = true;
  }
  return sendSuccess(res, notif, 'Notification marked as read');
};

export const markAllAsRead = async (req: Request, res: Response) => {
  notifications = notifications.map(n => ({ ...n, is_read: true }));
  return sendSuccess(res, null, 'All notifications marked as read');
};
