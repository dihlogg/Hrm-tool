import { useEffect, useState } from "react";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";
import { useAuthContext } from "@/contexts/authContext";

export function useDashboardData() {
  const { employee } = useAuthContext();
  
  const [leaveStats, setLeaveStats] = useState<any[]>([]);
  const [jobStats, setJobStats] = useState<any[]>([]);
  const [funnelStats, setFunnelStats] = useState<any[]>([]);
  const [myLeaveBalances, setMyLeaveBalances] = useState<any[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const endpoints = [
          axiosInstance.get(API_ENDPOINTS.GET_LEAVE_REQUEST_STATS),
          axiosInstance.get(API_ENDPOINTS.GET_JOB_STATUS_STATS),
          axiosInstance.get(API_ENDPOINTS.GET_APPLICATION_FUNNEL_STATS),
          axiosInstance.get(`${API_ENDPOINTS.GET_RECENT_EMPLOYEES}?sortBy=createDate&sortOrder=DESC&pageSize=5`),
          axiosInstance.get(`${API_ENDPOINTS.GET_TRENDING_POSTS}?limit=5`),
        ];

        if (employee?.id) {
          endpoints.push(axiosInstance.get(`${API_ENDPOINTS.GET_RECENT_NOTIFICATIONS}/${employee.id}?page=1&pageSize=5`));
          endpoints.push(axiosInstance.get(`${API_ENDPOINTS.GET_LEAVE_BALANCE_BY_EMPLOYEE_ID}/${employee.id}`));
        }

        const results = await Promise.allSettled(endpoints);

        if (results[0].status === 'fulfilled') setLeaveStats(results[0].value.data?.map((d: any) => ({ ...d, count: Number(d.count) })) || []);
        if (results[1].status === 'fulfilled') setJobStats(results[1].value.data?.map((d: any) => ({ ...d, count: Number(d.count) })) || []);
        if (results[2].status === 'fulfilled') setFunnelStats(results[2].value.data?.map((d: any) => ({ ...d, count: Number(d.count) })) || []);
        if (results[3].status === 'fulfilled') setRecentEmployees(results[3].value.data?.data || []);
        if (results[4].status === 'fulfilled') setTrendingPosts(results[4].value.data?.data || []);
        
        if (employee?.id) {
          if (results[5] && results[5].status === 'fulfilled') {
            setRecentNotifications(results[5].value.data?.data || []);
          }
          if (results[6] && results[6].status === 'fulfilled') {
            setMyLeaveBalances(results[6].value.data || []);
          }
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [employee?.id]);

  return {
    leaveStats,
    jobStats,
    funnelStats,
    myLeaveBalances,
    recentEmployees,
    trendingPosts,
    recentNotifications,
    loading
  };
}
