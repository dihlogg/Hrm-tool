export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  REMOTE = "REMOTE",
}

export interface JobDto {
  id: string;
  employeeId: string;
  title?: string;
  level?: string | null;
  jobTitleId?: string | null;
  jobTitleName?: string | null;
  subUnitId?: string | null;
  subUnitName?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  employmentType: EmploymentType;
  location?: string | null;
  description?: string | null;
  responsibilities?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  rawText?: string | null;
  parsedJson?: any | null;
  fileUrl?: string | null;
  storageKey?: string | null;
  status: JobStatus;
  createDate?: string;
  updateDate?: string;
}

export interface CreateJobDto {
  employeeId?: string;
  title?: string;
  level?: string | null;
  jobTitleId?: string | null;
  jobTitleName?: string | null;
  subUnitId?: string | null;
  subUnitName?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  employmentType?: EmploymentType;
  location?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  rawText?: string;
  parsedJson?: any;
  fileUrl?: string;
  storageKey?: string;
  status?: JobStatus;
}
