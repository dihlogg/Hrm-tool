export interface LeaveRequestDto {
  id?: string;
  fromDate?: string | null;
  toDate?: string | null;
  duration?: string | null;
  employeeId?: string | null;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
  leaveStatusId?: string | null;
  leaveStatus?: {
    id: string;
    name: string;
  };
  leaveReasonId?: string | null;
  leaveReason?: {
    id: string;
    name: string;
  };
  reasonDetails?: string | null;
  partialDayId?: string | null;
  partialDay?: {
    id: string;
    name: string;
  };
  leaveRequestTypeId?: string | null;
  leaveRequestType?: {
    id: string;
    name: string;
  };
  expectedApproverId?: string | null;
  expectedInformToId?: string | null;
  expectedConfirmId?: string | null;
  pendingId?: string | null;
  rejectId?: string | null;
  participantsRequests: {
    id: string;
    type: "approve" | "inform" | "confirm" | "pending" | "reject";
    employees: {
      id: string;
      firstName: string;
      lastName: string;
      imageUrl?: string;
    };
  }[];
}
