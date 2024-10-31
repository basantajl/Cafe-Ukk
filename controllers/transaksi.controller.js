const model = require("../models/index");
const transaksi = model.transaksi;
const detail_transaksi = model.detail_transaksi;
const meja = model.meja;
const kasir = model.user;
const { Op, where } = require("sequelize");
const { findHarga } = require("../controllers/menu.controller");

exports.createTransaction = async (req, res) => {
  const { kasirId, menuItems, id_meja, nama_pelanggan } = req.body;
  try {
    const tryFindMeja = await meja.findOne({ where: { id_meja: id_meja } });
    if (!tryFindMeja) {
      return res.status(400).json({ message: "Meja not found!" });
    }

    if (tryFindMeja.status === "tidak tersedia") {
      return res.status(400).json({ message: "Meja tidak tersedia!" });
    }

    const tryFindUser = await kasir.findOne({ where: { id_user: kasirId } });
    if (!tryFindUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    const newTransaction = await transaksi.create({
      id_user: kasirId,
      id_meja: id_meja,
      nama_pelanggan: nama_pelanggan,
      tgl_transaksi: new Date(),
      status: "belum_bayar",
    });

    let total = 0;
    for (const item of menuItems) {
      let harga = await findHarga(item.id_menu);
      const menuItem = await detail_transaksi.create({
        id_transaksi: newTransaction.id_transaksi,
        id_menu: item.id_menu,
        qty: item.qty,
        subtotal: item.qty * harga,
      });
      total += menuItem.subtotal;
    }

    await transaksi.update(
      { total },
      { where: { id_transaksi: newTransaction.id_transaksi } }
    );

    await meja.update(
      { status: "tidak tersedia" },
      { where: { id_meja: newTransaction.id_meja } }
    );

    res.json({ message: "Transaction created", transaction: newTransaction });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.findAllTransactions = async (req, res) => {
  try {
    const result = await transaksi.findAll({
      include: [
        { model: kasir, as: "user" },
        { model: detail_transaksi, as: "detail_transaksi" },
      ],
    });
    res.json({ transactions: result, count: result.length });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const id_transaksi = req.params.id_transaksi;
    const transaction = await transaksi.findOne({ where: { id_transaksi } });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const id_meja = transaction.id_meja;
    await transaksi.update({ status: "lunas" }, { where: { id_transaksi } });

    await meja.update({ status: "tersedia" }, { where: { id_meja } });

    res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.addAdditionalOrder = async (req, res) => {
  const { menuItems } = req.body;
  const {id_transaksi} = req.params;
  try {
    const transaction = await transaksi.findOne({ where: { id_transaksi: id_transaksi } });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let total = 0;
    for (const item of menuItems) {
      let harga = await findHarga(item.id_menu);
      const menuItem = await detail_transaksi.create({
        id_transaksi: id_transaksi,
        id_menu: item.id_menu,
        qty: item.qty,
        subtotal: item.qty * harga,
      });
      total += menuItem.subtotal;
    }

    await transaksi.increment('total', { by: total, where: { id_transaksi: id_transaksi } });

    res.json({ message: "Additional order added successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.filterTransactionsByDate = async (req, res) => {
  const { startDate, endDate } = req.body; 
  try {
    const result = await transaksi.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      include: [
        { model: kasir, as: "user" },
        { model: detail_transaksi, as: "detail_transaksi" },
      ],
    });
    res.json({ transactions: result, count: result.length });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await transaksi.findAll({
      where: { id_user: userId },
      include: [
        { model: kasir, as: "user" },
        { model: detail_transaksi, as: "detail_transaksi" },
      ],
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this user" });
    }

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
