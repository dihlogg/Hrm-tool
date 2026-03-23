export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}