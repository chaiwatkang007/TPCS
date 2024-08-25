export interface CreateUser {
  username: string;
  password: string;
  role: string;
  create_date: string;
}

export interface UpdateUser {
  id: string;
  username: string;
  password: string;
  role: string;
  create_date:string;
}
