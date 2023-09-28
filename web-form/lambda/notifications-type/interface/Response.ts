import { NotificationType } from './Notification';

export interface GetResponse {
  message: string;
  types?: NotificationType[];
}
