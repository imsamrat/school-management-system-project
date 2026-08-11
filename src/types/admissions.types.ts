export interface AdmissionApplication {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  previous_school?: string;
  applied_class: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
}
