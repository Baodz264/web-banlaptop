import ExcelJS from "exceljs";
import PDFDocument from "pdfkit-table";
import path from "path";

import axios from "axios";
class ExportService {
  // ---------------------- EXCEL ----------------------
  async exportExcel(data, columns, title = "BÁO CÁO") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data");

    // Fix lỗi Insert Title làm lệch cột của ExcelJS:
    // Ta không định nghĩa sheet.columns ngay từ đầu mà sẽ tự addRow
    
    // 1. Chèn Title (Dòng 1)
    const titleRow = sheet.addRow([title.toUpperCase()]);
    sheet.mergeCells(1, 1, 1, columns.length);
    titleRow.getCell(1).font = { size: 16, bold: true, color: { argb: "FF1F4E78" } };
    titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    titleRow.height = 35;

    // 2. Định dạng Header (Dòng 2)
    const headerRow = sheet.addRow(columns.map(col => col.header));
    headerRow.height = 25;
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = this._getThinBorder();
      
      // Set độ rộng cột dựa trên config truyền vào
      sheet.getColumn(colNumber).width = columns[colNumber - 1].width || 20;
    });

    // 3. Thêm Data
 // thêm trên đầu file

for (let index = 0; index < data.length; index++) {
  const item = data[index];

  const rowValues = columns.map(col => item[col.key]);
  const row = sheet.addRow(rowValues);

  const isEven = index % 2 === 0;

  row.eachCell((cell) => {
    cell.border = this._getThinBorder();
    cell.alignment = { vertical: "middle", indent: 1 };
    if (isEven) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF9F9F9" },
      };
    }
  });

  // 🔥 xử lý ảnh
  if (item.logo) {
    try {
      const url = `${process.env.BASE_URL}${item.logo}`;

      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });

      const ext = item.logo.split('.').pop().split('?')[0];

      const imageId = workbook.addImage({
        buffer: response.data,
        extension: ext,
      });

      const logoColIndex = columns.findIndex(c => c.key === "logo");

      if (logoColIndex !== -1) {
        sheet.addImage(imageId, {
          tl: { col: logoColIndex, row: row.number - 1 },
          ext: { width: 60, height: 40 },
        });

        row.height = 45;
      }

    } catch (err) {
      console.log("Image error:", err.message);
    }
  }
}

    return await workbook.xlsx.writeBuffer();
  }

  // ---------------------- PDF (ĐÃ SỬA LỖI FONT & TRÀN CỘT) ----------------------
  async exportPdf(data, columns, res, title = "BÁO CÁO") {
    // TỰ ĐỘNG CHỌN KHỔ GIẤY: Nếu > 6 cột thì dùng khổ ngang (Landscape) cho đẹp
    const isLandscape = columns.length > 6;
    const doc = new PDFDocument({ 
      margin: 30, 
      size: "A4", 
      layout: isLandscape ? "landscape" : "portrait" 
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=export_${Date.now()}.pdf`);
    doc.pipe(res);

    // CẤU HÌNH FONT TIẾNG VIỆT (BẮT BUỘC ĐỂ KHÔNG BỊ LỖI CHỮ)
    // Bạn cần trỏ đường dẫn tới file font .ttf trong máy bạn
    // Ví dụ: path.resolve('src/fonts/Roboto-Regular.ttf')
    try {
        // Nếu bạn chạy trên Windows, có thể dùng font Arial có sẵn:
        // doc.font('C:/Windows/Fonts/arial.ttf'); 
        // Hoặc font Helvetica (Mặc định - nhưng font này ko có tiếng Việt)
        doc.font('Helvetica'); 
    } catch (e) {
        console.warn("Không tìm thấy font tùy chỉnh, dùng font mặc định.");
    }

    // --- Header Title ---
    doc.fillColor("#1F4E78").fontSize(18).text(title.toUpperCase(), { align: "center" });
    doc.fontSize(8).fillColor("#777777").text(`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`, { align: "right" });
    doc.moveDown(1);

    // --- Cấu trúc Bảng ---
    const table = {
      headers: columns.map(col => ({ 
        label: col.header, 
        property: col.key, 
        width: isLandscape ? (750 / columns.length) : (500 / columns.length), // Tự chia đều chiều ngang
      })),
      datas: data,
    };

    // Vẽ bảng
    let startY = doc.y;

const pageWidth = isLandscape ? 800 : 550;
const colWidth = pageWidth / columns.length;

// ===== HEADER TABLE =====
const drawHeader = () => {
  columns.forEach((col, i) => {
    const x = 30 + i * colWidth;

    doc
      .fillColor("#4472C4")
      .rect(x, startY, colWidth, 25)
      .fill();

    doc
      .fillColor("#fff")
      .fontSize(10)
      .text(col.header, x + 5, startY + 8, {
        width: colWidth - 10,
        align: "center",
      });
  });

  startY += 25;
};

drawHeader();

// ===== ROW DATA =====
for (let i = 0; i < data.length; i++) {
  const row = data[i];

  // xuống trang nếu hết chỗ
  if (startY > doc.page.height - 60) {
    doc.addPage();
    startY = 30;
    drawHeader();
  }

  for (let j = 0; j < columns.length; j++) {
    const col = columns[j];
    const value = row[col.key];

    const x = 30 + j * colWidth;
    const y = startY;

    // zebra
    if (i % 2 === 0) {
      doc
        .rect(x, y, colWidth, 45)
        .fillOpacity(0.05)
        .fill()
        .fillOpacity(1);
    }

    // 🔥 IMAGE
    if (col.key === "logo" && value) {
      try {
        const url = `${process.env.BASE_URL}${value}`;

        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });

        doc.image(response.data, x + 10, y + 5, {
          width: 35,
          height: 35,
        });
      } catch (err) {
        doc
          .fontSize(8)
          .fillColor("red")
          .text("No Img", x + 5, y + 15);
      }
    } else {
      doc
        .fillColor("#000")
        .fontSize(9)
        .text(value ? String(value) : "", x + 5, y + 12, {
          width: colWidth - 10,
        });
    }
  }

  startY += 45;
}

// ===== FOOTER =====
const pageCount = doc.bufferedPageRange().count;

for (let i = 0; i < pageCount; i++) {
  doc.switchToPage(i);

  doc
    .fontSize(8)
    .fillColor("#999")
    .text(
      `Trang ${i + 1}/${pageCount}`,
      0,
      doc.page.height - 20,
      { align: "center" }
    );
}

    doc.end();
  }

  _getThinBorder() {
    return {
      top: { style: "thin", color: { argb: "FFDDDDDD" } },
      left: { style: "thin", color: { argb: "FFDDDDDD" } },
      bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
      right: { style: "thin", color: { argb: "FFDDDDDD" } },
    };
  }
}

export default new ExportService();