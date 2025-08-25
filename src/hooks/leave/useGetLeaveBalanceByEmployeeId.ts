import { useEffect, useState } from "react";
import { LeaveBalanceDto } from "./LeaveBalanceDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useGetLeaveBalanceByEmployeeId(employeeId: string) {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    const loadLeaveBalance = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_LEAVE_BALANCE_BY_EMPLOYEE_ID}/${employeeId}`
        );
        setLeaveBalance(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to get leave balance by employee id"
        );
      } finally {
        setLoading(false);
      }
    };
    loadLeaveBalance();
  }, [employeeId]);
  return { leaveBalance, error, loading };
}
