export interface CreateLeaveRequestDto {
  id?: string;
  fromDate?: Date;
  toDate?: Date;
  duration?: string;
  leaveStatusId?: string | null;
  leaveStatus?: {
    id: string;
    name: string;
  };
  leaveReasonId?: string | null;
  leaveReason?: {
    id: string;
    name: string
  }
  reasonDetails?: string;
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
  approver?: {
    id: string;
    name: string;
  }
}
