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
