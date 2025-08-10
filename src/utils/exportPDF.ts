import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (
  columns: any[],
  data: any[],
  fileName: string,
  title: string
) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);

  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, 10);

  // bỏ colum action
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

  // Lấy dữ liệu từ table
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

  // export table & style
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 17,
    showHead: "firstPage",
    theme: 'striped',
    styles: {
      fontSize: 9,
      textColor: [75, 85, 99],
      halign: "left",
      valign: "middle",
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: [229, 231, 235],
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [31, 41, 55],
      fontStyle: "bold",
      halign: "left",
      lineWidth: 0.1,
      lineColor: [229, 231, 235],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { top: 15 },
  });

  doc.save(fileName);
};
