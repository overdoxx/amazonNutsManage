const ExcelJS = require('exceljs');

class ExcelGenerator {
  async generateExcel(products) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    worksheet.columns = [
      { header: 'Nome do Produto', key: 'name', width: 30 },
      { header: 'Quantidade', key: 'quantity', width: 20 }, 
      { header: 'Situação', key: 'status', width: 12 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    products.forEach((product, index) => {
      const quantity = parseFloat(product.quantity);
      const unit = product.unit === 'KG' ? 'KG' : 'UND';

      
      let status = '✅ OK';
      let bgColor = '92D050'; 

      if ((unit === 'KG' && quantity <= 2) || (unit === 'UND' && quantity <= 5)) {
        status = '⚠️ WARN';
        bgColor = 'FFD966'; 
      }
      if ((unit === 'KG' && quantity <= 1) || (unit === 'UND' && quantity <= 3)) {
        status = '⛔ ALERT';
        bgColor = 'FF6666'; 
      }

      const updatedAt = product.updatedAt ? new Date(product.updatedAt) : new Date(product.createdAt);

      const row = worksheet.addRow({
        name: product.name,
        quantity: `${quantity.toFixed(2)} ${unit}`, 
        status
      });


      row.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
    });

    return await workbook.xlsx.writeBuffer();
  }
}

module.exports = new ExcelGenerator();
