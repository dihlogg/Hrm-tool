export type LeaveRequestFilters = {
  fromDate?: Date;
  toDate?: Date;
  employeeId?: string | null;
  leaveStatusId?: string;
  leaveReasonId?: string;
  partialDayId?: string;
  leaveRequestTypeId?: string;
};

export function getInitialFilters(): LeaveRequestFilters {
  return {
    fromDate: undefined,
    toDate: undefined,
    employeeId: "",
    leaveStatusId: "",
    leaveReasonId: "",
    partialDayId: "",
    leaveRequestTypeId: "",
  };
}
