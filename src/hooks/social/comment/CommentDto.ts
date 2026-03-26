export interface CommentDto {
  id: string;
  postId: string;
  employeeId: string;
  employeeFullName: string | null;
  employeeAvatarUrl: string | null;
  content: string;
  createDate: string;
  updateDate?: string;

  parentId?: string | null;
  repliesCount?: number;
  myReaction?: string | null;

  reactionCounts?: {
    id: string;
    reactionType: string;
    count: number;
  }[];
  children?: CommentDto[];
}

export interface CreateCommentDto {
  postId: string;
  content: string;
  parentId?: string | null;
  mentionedEmployeeIds?: string[];
}

export interface UpdateCommentDto {
  content: string;
}
