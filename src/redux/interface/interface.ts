import { IFetchData } from "./common";

export interface IRoom {
  id: string;
  name: string;
  provider_id: number;
}

export interface ISeat {
  index_id: number;
  booking_id: number;
  is_book: boolean;
  pc_no: number;
}

export interface IRoomDetails {
  address: string;
  closing_time: string;
  gaming_zone: string;
  gaming_zone_name: string;
  id: string;
  is_favorite: string;
  opening_time: string;
  phone: string;
  rating: string;
  rooms: IRoom[];
}

export type IRoomDetailsResponse = IFetchData<IRoomDetails>;
