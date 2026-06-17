export interface EducationEntry {
  gpa?: string;
  degree: string;
  school: string;
}

export interface ExperienceEntry {
  company: string;
  duration: string;
  position: string;
  description: string;
}

export interface CandidateMetadata {
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
}

export interface CandidateDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileUrl?: string;
  cvFileUrl?: string;
  storageKey?: string;
  summary?: string;
  coverLetter?: string;
  metadata?: CandidateMetadata;
}

export interface ApplicationDto {
  id: string;
  status:
    | "PARSING"
    | "PARSED_SUCCESS"
    | "PARSING_FAILED"
    | "MATCHED"
    | "MATCHING_FAILED"
    | "HIRED";
  matchScore?: number | string;
  skillMatchPercent?: number | string;
  experienceMatchStatus?: string;
  matchReason?: string;
  createDate: string;
  candidate: CandidateDto;
}
