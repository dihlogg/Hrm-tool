export interface LeaveTypeDto {
  id?: string;
  name: string;
  description: string;
  unit: string;
  maximumAllowed: number;
  maxCarryOver: number;
  expireMonth: number;
}
