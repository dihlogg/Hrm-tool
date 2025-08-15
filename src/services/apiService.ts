export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  //auth
  LOGIN: `${API_URL}/Auth/Login`,
  //employee
  GET_ALL_EMPLOYEES: `${API_URL}/Employees/GetAllEmployees`,
  GET_EMPLOYEE_BY_ID: `${API_URL}/Employees/GetEmployeeById`,
  POST_EMPLOYEE: `${API_URL}/Employees/PostEmployee`,
  PUT_EMPLOYEE: `${API_URL}/Employees/PutEmployee`,
  PATCH_EMPLOYEE_STATUS: `${API_URL}/Employees/PatchEmployeeStatusOnLeave`,
  GET_EMPLOYEE_LIST: `${API_URL}/Employees/GetEmployeeList`,
  GET_EMPLOYEE_DETAILS_BY_USER_ID: `${API_URL}/Employees/GetEmployeeDetailsByUserId`,
  //job titles
  GET_ALL_JOB_TITLES: `${API_URL}/JobTitles/GetAllJobTitles`,
  GET_JOB_TITLE_BY_ID: `${API_URL}/JobTitles/GetJobTitleById`,
  POST_JOB_TITLE: `${API_URL}/JobTitles/PostJobTitle`,
  PUT_JOB_TITLE: `${API_URL}/JobTitles/PutJobTitle`,
  DELETE_JOB_TITLE_BY_ID: `${API_URL}/JobTitles/DeleteJobTitle`,
  //sub units
  GET_ALL_SUB_UNITS: `${API_URL}/SubUnits/GetAllSubUnits`,
  //employee status
  GET_ALL_EMPLOYEE_STATUSES: `${API_URL}/EmployeeStatuses/GetAllEmployeeStatuses`,
  //user
  GET_USER_INFOR: `${API_URL}/Users/GetUserInfor`,
  //user status
  GET_ALL_USER_STAUSES: `${API_URL}/UserStatuses/GetAllUserStatuses`,
  //leave request
  POST_LEAVE_REQUEST: `${API_URL}/LeaveRequests/PostLeaveRequest`,
  GET_LEAVE_REQUEST_BY_EMPLOYEE_ID: `${API_URL}/LeaveRequests/GetLeaveRequestListByEmployeeId`,
  //leave status
  GET_ALL_LEAVE_STATUS: `${API_URL}/LeaveStatuses/GetAllLeaveStatuses`,
  //partial days
  GET_ALL_PARTIAL_DAY: `${API_URL}/PartialDays/GetAllPartialDays`,
  //leave reason
  GET_ALL_LEAVE_REASON: `${API_URL}/LeaveReasons/GetAllLeaveReasons`,
  //leave request type
  GET_ALL_LEAVE_REQUEST_TYPE: `${API_URL}/LeaveRequestTypes/GetAllLeaveRequestTypes`,
};
