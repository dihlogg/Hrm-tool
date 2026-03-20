export const HRM_API_URL =
  process.env.HRM_CORE_API_BASE_URL || "http://localhost:3001";
export const HRM_NOTIFY_API_URL =
  process.env.HRM_NOTIFY_API_BASE_URL || "http://localhost:3002";
export const HRM_SOCIAL_API_URL =
  process.env.NEXT_PUBLIC_HRM_SOCIAL_API_BASE_URL || "http://localhost:3003";

export const API_ENDPOINTS = {
  //hrm-api
  //auth
  LOGIN: `${HRM_API_URL}/Auth/Login`,
  REFRESH_TOKEN: `${HRM_API_URL}/Auth/RefreshToken`,
  //role
  GET_ALL_ROLES: `${HRM_API_URL}/Roles/GetAllRoles`,
  //employee
  GET_ALL_EMPLOYEES: `${HRM_API_URL}/Employees/GetAllEmployees`,
  GET_EMPLOYEE_BY_ID: `${HRM_API_URL}/Employees/GetEmployeeById`,
  POST_EMPLOYEE: `${HRM_API_URL}/Employees/PostEmployee`,
  PUT_EMPLOYEE: `${HRM_API_URL}/Employees/PutEmployee`,
  PATCH_EMPLOYEE_STATUS: `${HRM_API_URL}/Employees/PatchEmployeeStatusOnLeave`,
  GET_EMPLOYEE_LIST: `${HRM_API_URL}/Employees/GetEmployeeList`,
  GET_EMPLOYEE_DETAILS_BY_USER_ID: `${HRM_API_URL}/Employees/GetEmployeeDetailsByUserId`,
  GET_EMPLOYEE_BY_SUB_UNIT: `${HRM_API_URL}/Employees/GetEmployeeBySubUnit`,
  GET_SUPERVISOR_EMPLOYEE: `${HRM_API_URL}/Employees/GetSupervisorEmployee`,
  GET_DIRECTOR_BY_SUB_UNIT: `${HRM_API_URL}/Employees/GetDirectorBySubUnit`,
  GET_PARENT_FOR_EMPLOYEE: `${HRM_API_URL}/Employees/GetParentEmployee`,
  //job titles
  GET_ALL_JOB_TITLES: `${HRM_API_URL}/JobTitles/GetAllJobTitles`,
  GET_JOB_TITLE_BY_ID: `${HRM_API_URL}/JobTitles/GetJobTitleById`,
  POST_JOB_TITLE: `${HRM_API_URL}/JobTitles/PostJobTitle`,
  PUT_JOB_TITLE: `${HRM_API_URL}/JobTitles/PutJobTitle`,
  DELETE_JOB_TITLE_BY_ID: `${HRM_API_URL}/JobTitles/DeleteJobTitle`,
  //sub units
  GET_ALL_SUB_UNITS: `${HRM_API_URL}/SubUnits/GetAllSubUnits`,
  //employee status
  GET_ALL_EMPLOYEE_STATUSES: `${HRM_API_URL}/EmployeeStatuses/GetAllEmployeeStatuses`,
  //user
  GET_USER_LIST: `${HRM_API_URL}/Users/GetUserList`,
  GET_USER_INFOR: `${HRM_API_URL}/Users/GetUserInfor`,
  GET_USER_BY_ID: `${HRM_API_URL}/Users/GetUserById`,
  PUT_USER: `${HRM_API_URL}/Users/PutUser`,
  //user status
  GET_ALL_USER_STAUSES: `${HRM_API_URL}/UserStatuses/GetAllUserStatuses`,
  //leave request
  POST_LEAVE_REQUEST: `${HRM_API_URL}/LeaveRequests/PostLeaveRequest`,
  PUT_LEAVE_REQUEST: `${HRM_API_URL}/LeaveRequests/PutLeaveRequest`,
  GET_LEAVE_REQUEST_DETAIL_BY_ID: `${HRM_API_URL}/LeaveRequests/GetLeaveRequestById`,
  GET_LEAVE_REQUEST_BY_EMPLOYEE_ID: `${HRM_API_URL}/LeaveRequests/GetLeaveRequestListByEmployeeId`,
  GET_LEAVE_BALANCE_BY_EMPLOYEE_ID: `${HRM_API_URL}/LeaveRequests/GetLeaveBalancesByEmployeeId`,
  GET_LEAVE_REQUEST_FOR_SUPERVISOR: `${HRM_API_URL}/LeaveRequests/GetLeaveRequestsForSupervisor`,
  PATCH_LEAVE_REQUEST_STATUS: `${HRM_API_URL}/LeaveRequests/PatchLeaveRequestStatus`,
  GET_LEAVE_REQUEST_FOR_DIRECTOR: `${HRM_API_URL}/LeaveRequests/getLeaveRequestForDirector`,
  //leave status
  GET_ALL_LEAVE_STATUS: `${HRM_API_URL}/LeaveStatuses/GetAllLeaveStatuses`,
  //partial days
  GET_ALL_PARTIAL_DAY: `${HRM_API_URL}/PartialDays/GetAllPartialDays`,
  //leave reason
  GET_ALL_LEAVE_REASON: `${HRM_API_URL}/LeaveReasons/GetAllLeaveReasons`,
  //leave request type
  GET_ALL_LEAVE_REQUEST_TYPE: `${HRM_API_URL}/LeaveRequestTypes/GetAllLeaveRequestTypes`,

  //hrm-notify
  GET_LEAVE_REQUEST_NOTIFY: `${HRM_NOTIFY_API_URL}/Notifications/GetNotificationsByEmployeeId`,
  GET_UNSEEN_COUNT_BY_RECIPIENT_ID: `${HRM_NOTIFY_API_URL}/Notifications/GetUnSeenCountByRecipientId`,
  GET_UNREAD_COUNT_BY_RECIPIENT_ID: `${HRM_NOTIFY_API_URL}/Notifications/GetUnReadCountByRecipientId`,
  PATCH_MARK_AS_ALL_SEEN: `${HRM_NOTIFY_API_URL}/Notifications/MarkAllAsSeenByRecipientId`,
  PATCH_MARK_AS_READ: `${HRM_NOTIFY_API_URL}/Notifications/MarkAsRead`,

  //hrm-social
  //posts
  CREATE_POST: `${HRM_SOCIAL_API_URL}/Posts/CreateNewPost`,
  GET_POST_LIST: `${HRM_SOCIAL_API_URL}/Posts/GetPostList`,
  GET_POSTS_BY_EMPLOYEE: `${HRM_SOCIAL_API_URL}/Posts/GetPostsByEmployee`,
  GET_POST_BY_ID: `${HRM_SOCIAL_API_URL}/Posts/GetPostById`,
  UPDATE_POST: `${HRM_SOCIAL_API_URL}/Posts/UpdatePost`,
  DELETE_POST: `${HRM_SOCIAL_API_URL}/Posts/DeletePost`,
  GET_TOP_REACTED_POST: `${HRM_SOCIAL_API_URL}/Posts/GetTopReactedPosts`,
  GET_TOP_COMMENTED_POST: `${HRM_SOCIAL_API_URL}/Posts/GetTopCommentedPosts`,

  //comments
  CREATE_COMMENT: `${HRM_SOCIAL_API_URL}/Comments/CreateNewComment`,
  GET_COMMENTS_BY_POST: `${HRM_SOCIAL_API_URL}/Comments/GetCommentsByPost`,
  UPDATE_COMMENT: `${HRM_SOCIAL_API_URL}/Comments/UpdateComment`,
  DELETE_COMMENT: `${HRM_SOCIAL_API_URL}/Comments/DeleteComment`,

  //reactions
  TOGGLE_REACTION: `${HRM_SOCIAL_API_URL}/Reactions/CreateNewReaction`,
  GET_REACTIONS_BY_POST: `${HRM_SOCIAL_API_URL}/Reactions/GetReactionsByPost`,
  GET_REACTIONS_BY_COMMENT: `${HRM_SOCIAL_API_URL}/Reactions/GetReactionsByComment`,

  //reaction counts
  GET_REACTION_COUNT_BY_POST: `${HRM_SOCIAL_API_URL}/ReactionCounts/GetByPost`,
  GET_REACTION_COUNT_BY_COMMENT: `${HRM_SOCIAL_API_URL}/ReactionCounts/GetByComment`,
};
