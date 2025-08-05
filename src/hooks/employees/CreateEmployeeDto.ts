export interface CreateEmployeeDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  gender?: string | null;
  dayOfBirth?: string | null;
  nationality?: string | null;
  imageUrl?: string | null;
  employeeStatusId?: string | null;
  employeeStatus?: {
    id: string;
    name: string;
  };
  jobTitleId?: string | null;
  jobTitle?: {
    id: string;
    name: string;
  };
  subUnitId?: string | null;
  subUnit?: {
    id: string;
    name: string;
  };
  userId?: string | null;
  createLogin?: boolean;
  user?: {
    userName: string;
    password: string;
    userStatusId: string;
  };
}
