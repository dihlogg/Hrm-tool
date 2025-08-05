import type { SortOrder } from "antd/es/table/interface";

export function antdSortOrderToApiOrder(
  order: SortOrder | undefined
): "ASC" | "DESC" | undefined {
  if (order === "ascend") return "ASC";
  if (order === "descend") return "DESC";
  return undefined;
}
