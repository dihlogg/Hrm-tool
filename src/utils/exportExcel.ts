import * as XLSX from "xlsx";

export const exportExcel = (
  columns: any[],
  data: any[],
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
    if (col.title?.props?.children) {
      if (Array.isArray(col.title.props.children)) {
        return col.title.props.children.join(" ");
      }
      return String(col.title.props.children);
    }
    return "";
  });

  // Lấy dữ liệu từ bảng
  const tableRows = data.map((row) =>
    exportColumns.map((col) => {
      if (col.render) {
        const rendered = col.render(row[col.dataIndex], row);
        if (typeof rendered === "string") return rendered;
        if (typeof rendered === "number") return rendered.toString();
        return rendered?.props?.children || "";
      }
      const value = row[col.dataIndex];
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
