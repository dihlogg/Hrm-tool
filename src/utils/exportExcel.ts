import * as XLSX from "xlsx";

export const exportExcel = <T extends Record<string, unknown>>(
  columns: { key?: string; dataIndex?: string; title?: unknown; render?: (val: unknown, record: T) => unknown }[],
  data: T[],
  fileName: string,
  sheetName: string,
) => {
  // Bỏ cột action
  const exportColumns = columns.filter(
    (col) => (col.dataIndex || col.render) && col.key !== "actions"
  );

  // Lấy tiêu đề cột
  const tableColumn = exportColumns.map((col) => {
    if (typeof col.title === "string") return col.title;
    const titleObj = col.title as { props?: { children?: string | string[] } };
    if (titleObj?.props?.children) {
      if (Array.isArray(titleObj.props.children)) {
        return titleObj.props.children.join(" ");
      }
      return String(titleObj.props.children);
    }
    return "";
  });

  // Lấy dữ liệu từ bảng
  const tableRows = data.map((row) =>
    exportColumns.map((col) => {
      if (col.render) {
        const dataIndex = col.dataIndex as keyof T;
        const rendered = col.render(row[dataIndex], row);
        if (typeof rendered === "string") return rendered;
        if (typeof rendered === "number") return rendered.toString();
        const renderedObj = rendered as { props?: { children?: string } };
        return renderedObj?.props?.children || "";
      }
      const dataIndex = col.dataIndex as keyof T;
      const value = row[dataIndex];
      return value !== undefined && value !== null ? String(value) : "";
    })
  );

  // Tạo worksheet
  const wsData = [tableColumn, ...tableRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws["!cols"] = exportColumns.map(() => ({ wch: 20 }));

  // Tạo workbook và thêm worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Xuất file Excel với hỗ trợ Unicode
  XLSX.writeFile(wb, fileName, { bookType: "xlsx", type: "array" });
};
