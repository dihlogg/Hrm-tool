export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}