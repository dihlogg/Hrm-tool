import { NotificationType } from "./notificationType";

export interface NotificationPayload {
  _id: string;
  id: string;
  type: NotificationType;
  message: string;
  payload?: any;
  read: boolean;
  seen: boolean;
  actor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  previousStatus?: string;
  newStatus?: string;
  createdAt: string;
}
