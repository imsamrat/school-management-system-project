export interface SchoolProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  established_year: number;
  logo_url: string;
}

export interface SystemSettings {
  academic_year: string;
  currency: string;
  timezone: string;
  enable_sms_notifications: boolean;
  enable_email_notifications: boolean;
}
