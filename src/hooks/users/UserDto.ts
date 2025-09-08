export interface UserDto {
  id?: string;
  userName?: string;
  password?: string;
  employeeName?: string;
  userStatusId?: string | null;
  userStatus?: {
    id: string;
    name: string;
  };
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  userRole?: {
    id: string;
    role?: {
      id: string;
      name: string;
    };
  }[];
}
