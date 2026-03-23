export interface PostDto {
  id: string;
  employeeId: string;
  employeeFullName: string | null;
  employeeAvatarUrl: string | null;
  content: string;
  imageUrls?: string[] | null;
  status: string;
  createDate: string;
  updateDate: string;

  reactionCounts?: {
    id: string;
    reactionType: string;
    count: number;
  }[];

  reactions?: {
    id: string;
    reactionType: string;
    employeeId: string;
  }[];

  postComments?: any[];
  commentCount?: number;
}
