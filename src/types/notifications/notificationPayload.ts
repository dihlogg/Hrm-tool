export interface NotificationPayload {
  id: string;
  type: string;
  message: string;
  payload?: any;
  read: boolean;
  createdAt: string;
}