import { REFUSED } from "dns";

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  //hrm-api
  //auth
  LOGIN: `${API_URL}/hrm-api/Auth/Login`,
  REFRESH_TOKEN: `${API_URL}/hrm-api/Auth/RefreshToken`,
  //role
  GET_ALL_ROLES: `${API_URL}/hrm-api/Roles/GetAllRoles`,
  //employee
  GET_ALL_EMPLOYEES: `${API_URL}/hrm-api/Employees/GetAllEmployees`,
  GET_EMPLOYEE_BY_ID: `${API_URL}/hrm-api/Employees/GetEmployeeById`,
  POST_EMPLOYEE: `${API_URL}/hrm-api/Employees/PostEmployee`,
  PUT_EMPLOYEE: `${API_URL}/hrm-api/Employees/PutEmployee`,
  PATCH_EMPLOYEE_STATUS: `${API_URL}/hrm-api/Employees/PatchEmployeeStatusOnLeave`,
  GET_EMPLOYEE_LIST: `${API_URL}/hrm-api/Employees/GetEmployeeList`,
  GET_EMPLOYEE_DETAILS_BY_USER_ID: `${API_URL}/hrm-api/Employees/GetEmployeeDetailsByUserId`,
  GET_EMPLOYEE_BY_SUB_UNIT: `${API_URL}/hrm-api/Employees/GetEmployeeBySubUnit`,
  GET_SUPERVISOR_EMPLOYEE: `${API_URL}/hrm-api/Employees/GetSupervisorEmployee`,
  GET_DIRECTOR_BY_SUB_UNIT: `${API_URL}/hrm-api/Employees/GetDirectorBySubUnit`,
  GET_PARENT_FOR_EMPLOYEE: `${API_URL}/hrm-api/Employees/GetParentEmployee`,
  //job titles
  GET_ALL_JOB_TITLES: `${API_URL}/hrm-api/JobTitles/GetAllJobTitles`,
  GET_JOB_TITLE_BY_ID: `${API_URL}/hrm-api/JobTitles/GetJobTitleById`,
  POST_JOB_TITLE: `${API_URL}/hrm-api/JobTitles/PostJobTitle`,
  PUT_JOB_TITLE: `${API_URL}/hrm-api/JobTitles/PutJobTitle`,
  DELETE_JOB_TITLE_BY_ID: `${API_URL}/hrm-api/JobTitles/DeleteJobTitle`,
  //sub units
  GET_ALL_SUB_UNITS: `${API_URL}/hrm-api/SubUnits/GetAllSubUnits`,
  //employee status
  GET_ALL_EMPLOYEE_STATUSES: `${API_URL}/hrm-api/EmployeeStatuses/GetAllEmployeeStatuses`,
  //user
  GET_USER_LIST: `${API_URL}/hrm-api/Users/GetUserList`,
  GET_USER_INFOR: `${API_URL}/hrm-api/Users/GetUserInfor`,
  GET_USER_BY_ID: `${API_URL}/hrm-api/Users/GetUserById`,
  PUT_USER: `${API_URL}/hrm-api/Users/PutUser`,
  //user status
  GET_ALL_USER_STAUSES: `${API_URL}/hrm-api/UserStatuses/GetAllUserStatuses`,
  //leave request
  POST_LEAVE_REQUEST: `${API_URL}/hrm-api/LeaveRequests/PostLeaveRequest`,
  GET_LEAVE_REQUEST_BY_EMPLOYEE_ID: `${API_URL}/hrm-api/LeaveRequests/GetLeaveRequestListByEmployeeId`,
  GET_LEAVE_BALANCE_BY_EMPLOYEE_ID: `${API_URL}/hrm-api/LeaveRequests/GetLeaveBalancesByEmployeeId`,
  GET_LEAVE_REQUEST_FOR_SUPERVISOR: `${API_URL}/hrm-api/LeaveRequests/GetLeaveRequestsForSupervisor`,
  PATCH_LEAVE_REQUEST_STATUS: `${API_URL}/hrm-api/LeaveRequests/PatchLeaveRequestStatus`,
  GET_LEAVE_REQUEST_FOR_DIRECTOR: `${API_URL}/hrm-api/LeaveRequests/getLeaveRequestForDirector`,
  //leave status
  GET_ALL_LEAVE_STATUS: `${API_URL}/hrm-api/LeaveStatuses/GetAllLeaveStatuses`,
  //partial days
  GET_ALL_PARTIAL_DAY: `${API_URL}/hrm-api/PartialDays/GetAllPartialDays`,
  //leave reason
  GET_ALL_LEAVE_REASON: `${API_URL}/hrm-api/LeaveReasons/GetAllLeaveReasons`,
  //leave request type
  GET_ALL_LEAVE_REQUEST_TYPE: `${API_URL}/hrm-api/LeaveRequestTypes/GetAllLeaveRequestTypes`,

  //hrm-notify
  GET_LEAVE_REQUEST_NOTIFY: `${API_URL}/hrm-notify/Notifications/GetNotificationsByEmployeeId`,
  GET_UNSEEN_COUNT_BY_ACTOR_ID: `${API_URL}/hrm-notify/Notifications/GetUnSeenCountByActorId`,
  GET_UNREAD_COUNT_BY_ACTOR_ID: `${API_URL}/hrm-notify/Notifications/GetUnReadCountByActorId`,
  PATCH_MARK_AS_ALL_SEEN: `${API_URL}/hrm-notify/Notifications/MarkAllAsSeenByActorId`,
  PATCH_MARK_AS_READ: `${API_URL}/hrm-notify/Notifications/MarkAsRead`,
};
