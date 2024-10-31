const model = require("../models/index");
const transaksi = model.transaksi;
const kasir = model.user;
const detail_transaksi = model.detail_transaksi;
const PDFDocument = require('pdfkit'); 

exports.printReceipt = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await transaksi.findOne({
      where: { id_transaksi: transactionId },
      include: [
        { model: kasir, as: "user" },
        { model: detail_transaksi, as: "detail_transaksi", include: ["menu"] },
      ],
    });

    if (transaction) {
      const receipt = {
        cafeName: "Wikusama Cafe",
        date: transaction.tgl_transaksi,
        kasir: transaction.user.nama_user,
        namaPelanggan: transaction.nama_pelanggan,
        menuItems: {},
        total: transaction.total,
      };

      transaction.detail_transaksi.forEach(item => {
        const menuName = item.menu.nama_menu;
        if (receipt.menuItems[menuName]) {
          receipt.menuItems[menuName].qty += item.qty; 
        } else {
          receipt.menuItems[menuName] = {
            qty: item.qty,
            subtotal: item.subtotal,
          };
        }
      });

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      let filename = `receipt_${transactionId}.pdf`;
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', 'application/pdf');

      doc.pipe(res);

      doc.fontSize(30).text(receipt.cafeName, { align: 'center' }).moveDown();
      doc.fontSize(12).text(`Date: ${receipt.date}`, { align: 'center' });
      doc.text(`Kasir: ${receipt.kasir}`, { align: 'center' });
      doc.text(`Nama Pelanggan: ${receipt.namaPelanggan}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(16).text('Menu Items:', { underline: true }).moveDown();

     
      for (const [menuName, details] of Object.entries(receipt.menuItems)) {
        doc.fontSize(12).text(menuName, { continued: true });
        doc.text(`  Qty: ${details.qty}`, { align: 'right' });
        doc.text(`  Price: ${details.subtotal}`, { align: 'right' });
      }

      doc.moveDown();

      doc.fontSize(14).text(`Total: ${receipt.total}`, { align: 'right', underline: true });

      doc.moveDown();
      doc.fontSize(10).text('Thank you for visiting!', { align: 'center' });

      doc.end();
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
