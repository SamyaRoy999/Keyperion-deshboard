export interface IFetch {
  status: string;
  status_code: number;
  message: string;
}

export interface IFetchData<T> extends IFetch {
  data: T;
}
