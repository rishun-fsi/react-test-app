export interface DbNotification {
  title: string;
  content: string;
  user_id: string;
  type_id: number;
  created_date: Date;
  updated_date?: Date;
  publish_timestamp?: Date;
  expire_timestamp?: Date;
}
export interface NotificationDetail {
  content: string;
  date?: string;
}

export interface Notification {
  id: number;
  title: string;
  userId: string;
  createdDate: string;
  updatedDate?: string;
  publishTimestamp?: Date;
  expireTimestamp?: Date;
  typeId: number;
  type: string;
}
