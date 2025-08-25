export interface LeaveBalanceDto {
  leaveRequestTypeId: string;
  leaveRequestTypeName: string;
  maximumAllowed: number;
  approvedQuotas: number;
  pendingQuotas: number;
  remainingQuotas: number;
}
