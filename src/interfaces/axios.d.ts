export interface AxiosSuccessResponse {
  status: boolean;
  message: string;
  payload?: any;
}

export interface AxiosErrorResponse {
  code: string;
  response: {
    status: number;
    data: AxiosSuccessResponse;
  };
}
