export type JobFilters = {
  keyword?: string;
  level?: string;
  jobTitleName?: string;
  location?: string;
  employmentType?: string;
};

export function getInitialJobFilters(): JobFilters {
  return {
    keyword: "",
    level: "",
    jobTitleName: "",
    location: "",
    employmentType: undefined,
  };
}
