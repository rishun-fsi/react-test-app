export interface Notification {
  id: number;
  title: string;
  type: string;
  createdDate: string;
  userId: string;
  typeId: number;
  updatedDate?: string;
  publishTimestamp?: Date;
  expireTimestamp?: Date;
  
}

export interface NotificationDetail {
  content: string;
  date: string;
}

export interface NotificationType {
  id: number;
  name: string;
}

export type NotificationFormItemProps = {
  name: string;
  inputElement: JSX.Element;
  required?: boolean;
};

export interface NotificationCreationRequest {
  title: string;
  typeId: number;
  content: string;
  userId: string;
  publishTimestamp?: string;
  expireTimestamp?: string;
}
