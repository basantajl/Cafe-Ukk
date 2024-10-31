const model = require("../models/index");
const menu = model.menu;
const { uploadMenu } = require("../controllers/upload-foto.controller");
const { Op } = require("sequelize");
const fs = require("fs"); 

exports.findAll = async (req, res) => {
  try {
    const result = await menu.findAll();
    res.json({
      menu: result,
      count: result.length,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

exports.findHarga = async (id_menu) => {
  try {
    const result = await menu.findOne({
      where: {
        id_menu: id_menu,
      },
      attributes: ["harga"],
    });
    return result.dataValues.harga;
  } catch (error) {
    return error.message;
  }
};

exports.findById = async (req, res) => {
  try {
    const result = await menu.findOne({ where: { id_menu: req.params.id } });
    res.json({
      menu: result,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

exports.create = async (req, res) => {
  uploadMenu.single("image")(req, res, async (error) => {
    if (!req.file) {
      return res.json({
        message: "No uploaded file",
      });
    }

    if (!req.body) {
      return res.json({
        message: "No data provided",
      });
    }

    let data = {
      nama_menu: req.body.nama_menu,
      jenis: req.body.jenis,
      deskripsi: req.body.deskripsi,
      gambar: req.file.filename,
      harga: parseFloat(req.body.harga),
    };

    try {
      await menu.create(data).then((result) => {
        return res.json({
          status: true,
          data: result,
          message: "New menu has been inserted",
        });
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  });
};

exports.update = async (req, res) => {
  uploadMenu.single("image")(req, res, async (error) => {
    let param = { id_menu: req.params.id };
    const menuItem = await menu.findOne({ where: param });
    let data = {
      nama_menu: req.body.nama_menu,
      jenis: req.body.jenis,
      deskripsi: req.body.deskripsi,
      harga: req.body.harga,
    };

    if (req.file) {
      const oldImagePath = `./gambar/menu/${menuItem.gambar}`;
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
      data.gambar = req.file.filename;
    }

    try {
      await menu.update(data, { where: param });
      res.json({
        message: "data has been updated",
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  });
};

exports.delete = async (req, res) => {
  let param = { id_menu: req.params.id };
  try {
    const menuItem = await menu.findOne({ where: param });
    if (menuItem) {
      const imagePath = `./gambar/menu/${menuItem.gambar}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    await menu.destroy({ where: param });
    res.json({
      message: "data has been deleted",
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

exports.search = async (req, res) => {
  let keyword = req.params.keyword;
  try {
    const result = await menu.findAll({
      where: {
        [Op.or]: [
          { id_menu: { [Op.like]: `%${keyword}%` } },
          { nama_menu: { [Op.like]: `%${keyword}%` } },
          { jenis: { [Op.like]: `%${keyword}%` } },
          { deskripsi: { [Op.like]: `%${keyword}%` } },
          { harga: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });
    res.json({
      menu: result,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
