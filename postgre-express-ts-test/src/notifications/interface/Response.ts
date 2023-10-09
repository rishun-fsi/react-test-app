import { Notification } from "./Notification";

export interface PostResponse {
  message: string;
  id?: number;
  title?: string;
}

export interface GetResponse {
  notifications: Notification[];
}

