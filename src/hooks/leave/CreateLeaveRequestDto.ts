export interface CreateLeaveRequestDto {
  id?: string;
  fromDate?: string | null;
  toDate?: string | null;
  duration?: string | null;
  leaveStatusId?: string | null;
  leaveStatus?: {
    id: string;
    name: string
  }
  leaveReasonId?: string | null;
  leaveReason?: {
    id: string;
    name: string
  }
  reasonDetails?: string | null;
  partialDayId?: string | null;
  partialDay?: {
    id: string;
    name: string;
  }
  leaveRequestTypeId?: string | null;
  leaveRequestType?: {
    id: string;
    name: string;
  }
  employeeId?: string | null;
  employee?: {
    id: string;
    name: string;
  }
  approverId?: string | null;
  approve?: {
    id: string;
    name: string;
  }
  informToId?: string | null;
  inform?: {
    id: string;
    name: string;
  }
}
