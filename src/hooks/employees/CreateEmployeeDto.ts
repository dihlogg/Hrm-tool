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
  employmentType?: string | null // 'official' | 'temporary'
  jobTitleId?: string | null;
  subUnitId?: string | null;
  userId?: string | null;
  createLogin?: boolean;
  user?: {
    userName: string;
    password: string;
    userStatusId: string;
  };
}
