export interface Request {
  id: number;
  requestType: string;
  timeRequest: string;
  duration: number;
  reason: string;
  approver: string;
  delegateTo: string;
  status: string;
  partialDays?: string;
  requester?: string;
}

export const mockRequests: Request[] = [
  {
    id: 1,
    requestType: "Nghi Phép",
    timeRequest: "From...To...On...",
    duration: 1,
    reason: "Lý do...",
    approver: "Supervisor",
    delegateTo: "SupervisorBid",
    status: "Submitted",
  },
  {
    id: 2,
    requestType: "Nghi Phép",
    timeRequest: "From...To...On...",
    duration: 1,
    reason: "Lý do...",
    approver: "Supervisor",
    delegateTo: "SupervisorBid",
    status: "Submitted",
  },
  {
    id: 3,
    requestType: "Nghi Phép",
    timeRequest: "From...To...On...",
    duration: 1,
    reason: "Lý do...",
    approver: "Supervisor",
    delegateTo: "SupervisorBid",
    status: "Submitted",
  },
];