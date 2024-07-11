export type user = {
  id: string;
  name: string;
  email: string;
  role: ['super_admin', 'admin', 'user'];
  contactNo?: string;
  address?: string;
  profileImg?: string;
  password?: string;
};
