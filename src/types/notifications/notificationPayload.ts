import { NotificationType } from "./notificationType";

export interface NotificationPayload {
  _id: string;
  id: string;
  type: NotificationType;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  read: boolean;
  seen: boolean;
  actor?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatarUrl?: string;
  };
  previousStatus?: string;
  newStatus?: string;
  createdAt: string;
}
