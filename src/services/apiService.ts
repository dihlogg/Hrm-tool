export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  //auth
  LOGIN: `${API_URL}/Auth/Login`,
  //job titles
  GET_ALL_JOB_TITLES: `${API_URL}/JobTitles/GetAllJobTitles`,
  //sub units
  GET_ALL_SUB_UNITS: `${API_URL}/SubUnits/GetAllSubUnits`,
  //user status
  GET_ALL_USER_STAUSES: `${API_URL}/UserStatuses/GetAllUserStatuses`,
  //employee-status
  GET_ALL_EMPLOYEE_STATUSES: `${API_URL}/EmployeeStatuses/GetAllEmployeeStatuses`,
  //employee
  GET_ALL_EMPLOYEES: `${API_URL}/Employees/GetAllEmployees`,
  GET_EMPLOYEE_BY_ID: `${API_URL}/Employees/GetEmployeeById`,
  POST_EMPLOYEE: `${API_URL}/Employees/PostEmployee`,
  PUT_EMPLOYEE: `${API_URL}/Employees/PutEmployee`,
  GET_EMPLOYEE_LIST: `${API_URL}/Employees/GetEmployeeList`,
};
