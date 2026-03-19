export type PostFilters = {
  content?: string;
  status?: string;
};

export function getInitialPostFilters(): PostFilters {
  return {
    content: "",
    status: "",
  };
}