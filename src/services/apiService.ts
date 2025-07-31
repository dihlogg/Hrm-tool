export const API_URL = "http://localhost:5678";

export const API_ENDPOINTS = {
  //auth
  LOGIN: `${API_URL}/Auth/Login`,
  //job titles
  GET_ALL_JOB_TITLES: `${API_URL}/JobTitles/GetAllJobTitles`,
  //sub units
  GET_ALL_SUB_UNITS: `${API_URL}/SubUnits/GetAllSubUnits`,
  //user status
  GET_ALL_USER_STAUSES: `${API_URL}/UserStatuses/GetAllUserStatuses`,
  //employee
  GET_ALL_EMPLOYEES: `${API_URL}/Employees/GetAllEmployees`,
  POST_EMPLOYEE: `${API_URL}/Employees/PostEmployee`,
};
