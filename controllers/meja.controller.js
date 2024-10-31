const model = require("../models/index");
const meja = model.meja;

//menampilkan semua data meja
exports.findAll = async (req, res) => {
  try {
    const result = await meja.findAll();
    res.json({
      meja: result,
      count: result.length,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//menampilkan data meja berdasarkan id
exports.findById = async (req, res) => {
  try {
    const result = await meja.findOne({ where: { id_meja: req.params.id } });
    res.json({
      meja: result,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

exports.findByKeyword = async (req, res) => {
  try {
    const result = await meja.findOne({ where: { id_meja: req.params.id_meja } });
    res.json({
      meja: result,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//menambahkan data meja baru
exports.create = async (req, res) => {
  let data = {
    nomor_meja: req.body.nomor_meja,
    status: "tersedia",
  };
  try {
    await meja.create(data);
    res.json({
      message: "data has been inserted",
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//mengubah data meja berdasarkan id
exports.update = async (req, res) => {
  let param = { id_meja: req.params.id };
  let data = {
    nomor_meja: req.body.nomor_meja,
    status: req.body.status,
  };

  try {
    await meja.update(data, { where: param });
    res.json({
      message: "data has been updated",
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//menghapus data meja berdasarkan id
exports.delete = async (req, res) => {
  let param = { id_meja: req.params.id };
  try {
    await meja.destroy({ where: param });
    res.json({
      message: "data has been deleted",
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
