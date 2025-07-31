export interface CreateEmployeeDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  gender?: string;
  dayOfBirth?: Date;
  nationality?: string;
  imageUrl?: string;
  employmentType?: string // 'official' | 'temporary'
  jobTitleId?: string;
  subUnitId?: string;
  userId?: string;
  createLogin?: boolean;
  user?: {
    userName: string;
    password: string;
    userStatusId: string;
  };
}