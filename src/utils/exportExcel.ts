import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (
  columns: any[],
  data: any[],
  fileName: string,
  title: string
) => {
  // bỏ column action
  const exportColumns = columns.filter(
    (col) => (col.dataIndex || col.render) && col.key !== "actions"
  );

  // lấy tiêu đề
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

  // lấy data
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

  // gộp header + body
  const worksheetData = [tableColumn, ...tableRows];

  // tạo sheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);

  // export file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(dataBlob, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
};
