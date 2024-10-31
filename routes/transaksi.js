const express = require("express");
const { authorize } = require("../controllers/auth.controller");
const { isAdmin } = require("../middleware/role-validation");
const transaksiController = require("../controllers/transaksi.controller");
const printController = require("../controllers/print-receipt.controller");

const app = express();
app.use(express.json());

app.get("/", authorize, transaksiController.findAllTransactions);
app.get("/print-receipt/:transactionId", authorize, printController.printReceipt);
app.post("/", authorize, transaksiController.createTransaction);
app.post("/additionalOrder/:id_transaksi", authorize, transaksiController.addAdditionalOrder);
app.post("/updatetransaction/:id_transaksi", authorize, transaksiController.updateTransaction);
app.get("/findByDate", authorize, transaksiController.filterTransactionsByDate);
app.get("/:userId", authorize, transaksiController.getTransactionsByUserId);

module.exports = app;
