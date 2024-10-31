const bcrypt = require("bcrypt");
const model = require("../models/index");
const user = model.user;

exports.findAll = async (req, res) => {
  user
    .findAll()
    .then((result) => {
      res.json({
        user: result,
        count: result.length,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.findById = async (req, res) => {
  user
    .findOne({ where: { id_user: req.params.id } })
    .then((result) => {
      res.json({
        user: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.create = async (req, res) => {
  let data = {
    nama_user: req.body.nama_user,
    role: req.body.role,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
  };

  user
    .create(data)
    .then((result) => {
      res.json({
        data: result,
        message: "data has been inserted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.update = async (req, res) => {
  let param = {
    id_user: req.params.id,
  };
  let data = {
    nama_user: req.body.nama_user,
    role: req.body.role,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
  };

  user
    .update(data, { where: param })
    .then((result) => {
      res.json({
        data: result,
        message: "data has been updated",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.delete = async (req, res) => {
  let param = {
    id_user: req.params.id,
  };
  user
    .destroy({ where: param })
    .then((result) => {
      res.json({
        message: "data has been deleted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.searchByKeyword = async (req, res) => {
    const { keyword } = req.params;
    const { Op } = require('sequelize');

    user.findAll({
        where: {
            [Op.or]: [
                { nama_user: { [Op.like]: `%${keyword}%` } },
                { username: { [Op.like]: `%${keyword}%` } }
            ]
        }
    })
    .then(result => {
        res.json({
            users: result,
            count: result.length,
            message: "Search completed successfully"
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
};
