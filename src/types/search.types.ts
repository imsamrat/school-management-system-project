export interface SearchResult {
  id: string;
  type: 'Student' | 'Teacher' | 'Book';
  title: string;
  subtitle: string;
  link: string;
}
