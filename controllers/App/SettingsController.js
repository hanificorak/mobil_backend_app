const db = require("../../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getData = async (req, res) => {
  try {
    const { id } = req.user;

    const [settings] = await db.execute(
      `SELECT * FROM settings WHERE user_id = ?`,
      [id]
    );

    res.json({
      status: true,
      obj: settings,
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.save = async (req, res) => {
  try {
    const { reminder_status, last_date_app, password_int_status } = req.body;
    const { id } = req.user;

    const [result] = await db.execute(
      `UPDATE settings 
         SET reminder_status = ?, last_date_app = ?, password_int_status = ? 
         WHERE user_id = ?`,
      [reminder_status, last_date_app, password_int_status, id]
    );

    if (result.affectedRows > 0) {
      res.json({ status: true, message: "Ayarlar başarıyla güncellendi." });
    } else {
      res
        .status(404)
        .json({ status: false, error: "Kullanıcı ayarları bulunamadı." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, error: err.message });
  }
};
