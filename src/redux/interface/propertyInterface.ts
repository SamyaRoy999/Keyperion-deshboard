// ─── Property Interfaces ───────────────────────────────────────────────────

export interface IUnit {
  id: number;
  floor_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IFloor {
  id: number;
  property_id: number;
  floor_numbers: number;
  units: IUnit[];
  created_at: string;
  updated_at: string;
}

export interface IOwner {
  id: number;
  name: string;
  email: string;
  subscriptions: null | any;
  property: null | any;
  property_info: null | any;
}

export interface IProperty {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  assign_manager: null | number;
  units_count: number;
  owner: IOwner;
  manager: null | any;
  floors: IFloor[];
}

export interface IPropertyListData {
  current_page: number;
  data: IProperty[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface IPropertyListResponse {
  status: boolean;
  message: string;
  data: IPropertyListData;
}
