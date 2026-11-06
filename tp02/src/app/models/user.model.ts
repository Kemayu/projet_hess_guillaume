export interface User {
  id?: number | string;
  email: string;
  lastName: string;
  firstName: string;
  address: string;
}

export type UserPayload = Omit<User, 'id'> & {
  password: string;
  confirmPassword: string;
};
