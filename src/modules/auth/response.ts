export interface LogInResponse {
  status: string;
  message: string;
  userInfo: {
    _id: string;
    username: string;
    name: string;
  };
}
