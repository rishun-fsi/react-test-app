export interface Notification {
  registerDate: Date;
  headline: String;
  content: String;
  registrant: String;
}

export interface NotificationType {
  id: number;
  name: string;
}
