import { Questionnair } from './Questionnair';

export interface GetResponse {
  questionnairs: Questionnair[];
  totalCount: number;
}
