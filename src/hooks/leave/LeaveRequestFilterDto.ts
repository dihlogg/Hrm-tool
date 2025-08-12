export type LeaveRequestFilters = {
  fromDate?: Date;
  toDate?: Date;
  employeeId?: string;
  leaveStatusId?: string;
  leaveReasonId?: string;
  partialDayId?: string
};

export function getInitialFilters(): LeaveRequestFilters {
  return {
    fromDate: undefined,
    toDate: undefined,
    employeeId: "",
    leaveStatusId: "",
    leaveReasonId: "",
    partialDayId: "",
  };
}
