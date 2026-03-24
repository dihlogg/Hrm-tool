export interface CreatePostDto {
  content: string;
  imageUrls?: string[];
  status: string;
  mentionedEmployeeIds?: string[];
}