export interface PostEventBody {
  title: string;
  content: string;
  typeId: number;
  userId: string;
  publishTimestamp?: string;
  expireTimestamp?: string;
}
