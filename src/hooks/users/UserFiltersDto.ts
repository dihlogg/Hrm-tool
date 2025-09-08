export type UserFilters = {
  userName?: string;
  firstName?: string;
  lastName?: string;
  userStatusId?: string;
  roleId?: string;
  employeeName?: string;
};

export function getInitialFilters(): UserFilters {
  return {
    userName: "",
    firstName: "",
    lastName: "",
    userStatusId: "",
    roleId: "",
    employeeName: ""
  };
}
