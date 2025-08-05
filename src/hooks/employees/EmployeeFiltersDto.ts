export type EmployeeFilters = {
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  employeeStatusId?: string;
  jobTitleId?: string;
  subUnitId?: string;
};

export function getInitialFilters(): EmployeeFilters {
  return {
    firstName: "",
    lastName: "",
    employeeId: "",
    employeeStatusId: "",
    jobTitleId: "",
    subUnitId: "",
  };
}
