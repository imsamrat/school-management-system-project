export interface GeneralReportData {
  attendance: { month: string; present: number; absent: number; }[];
  finance: { month: string; collected: number; pending: number; }[];
}
