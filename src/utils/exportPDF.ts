import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = <T extends Record<string, unknown>>(
  columns: { key?: string; dataIndex?: string; title?: unknown; render?: (val: unknown, record: T) => unknown }[],
  data: T[],
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
    const titleObj = col.title as { props?: { children?: string | string[] } };
    if (titleObj?.props?.children) {
      if (Array.isArray(titleObj.props.children)) {
        return titleObj.props.children.join(" ");
      }
      return String(titleObj.props.children);
    }
    return "";
  });

  // Lấy dữ liệu từ table
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
