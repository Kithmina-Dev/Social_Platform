export interface ApiResponse<T = any> {
  status: boolean;
  path: string;
  message: string;
  statusCode: number;
  data: T;
  timestamp: string;
}
