export interface ReactionDto {
  id: string;
  reactionType: string;
  employeeId: string;
  postId?: string | null;
  commentId?: string | null;
  createDate?: string;
}

export interface ReactionCountDto {
  id?: string;
  reactionType: string;
  count: number;
  postId?: string | null;
  commentId?: string | null;
}

export interface ToggleReactionDto {
  reactionType: string;
  postId?: string | null;
  commentId?: string | null;
}
