const db = require("../../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getData = async (req, res) => {
  try {
    const { id } = req.user;
    let { category, date, location, status } = req.body;

    if (date) {
      date = convertToMysqlDateFormat(date); // "13.08.2025" -> "2025-08-13"
    }

    let query = `
      SELECT a.*, 
             ct.title as category_name,
             pl.title as priot_name,
             cl.title as color_name,
             cl.code as color_code
      FROM appointments as a
      INNER JOIN category_lists as ct ON ct.id = a.category_id
      INNER JOIN priots_lists as pl ON pl.id = a.priot
      INNER JOIN color_lists as cl ON cl.id = a.color_id
      WHERE a.create_user_id = ? `;

    const queryParams = [id];

    if (category) {
      query += " AND a.category_id = ?";
      queryParams.push(category);
    }

    if (date) {
      query += " AND a.date = ?";
      queryParams.push(date);
    }

    if (location) {
      query += " AND a.location = ?";
      queryParams.push(location);
    }
    if (status) {
      query += " AND a.status = ?";
      queryParams.push(status);
    }

    query += " order by a.id desc";

    const [rows] = await db.execute(query, queryParams);

    res.json({ status: true, obj: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, error: "Sistem hatası" });
  }
};
// Yardımcı fonksiyon
function convertToMysqlDateFormat(dateStr) {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

exports.getParam = async (req, res) => {
  try {
    const { id, email, name } = req.user;

    const [category_lists] = await db.execute(
      `SELECT * FROM category_lists WHERE create_user_id = ?`,
      [id]
    );
    const [color_lists] = await db.execute(`SELECT * FROM color_lists`);
    const [priots_lists] = await db.execute(`SELECT * FROM priots_lists`);

    res.json({
      status: true,
      category_lists: category_lists,
      color_lists: color_lists,
      priots_lists: priots_lists,
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.save = async (req, res) => {
  try {
    const { title, category, priot, color, date, time, location, edit_id, status } =
      req.body;

    const { id } = req.user;
    let savedate;
    if (date) {
      savedate = convertToMysqlDateFormat(date); // "13.08.2025" -> "2025-08-13"
    }

    if (edit_id) {
      await db.query(
        `UPDATE appointments 
         SET updated_at = NOW(), update_user_id = ?, title = ?, category_id = ?, priot = ?, color_id = ?, date = ?, time = ?, location = ?, status = ?
         WHERE id = ?`,
        [id, title, category, priot, color, savedate, time, location, status, edit_id]
      );

      res.json({
        status: true,
        message: "Randevu güncellemesi başarıyla gerçekleşti.",
      });
    } else {
      await db.query(
        `INSERT INTO appointments 
         (created_at, create_user_id, title, category_id, priot, color_id, date, time, location,status)
         VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [id, title, category, priot, color, savedate, time, location, status]
      );

      res.json({
        status: true,
        message: "Randevu kaydı başarıyla gerçekleşti.",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.body;

    const del = await db.execute(`DELETE FROM appointments WHERE id = ?`, [id]);

    res.json({
      status: true,
      message: "Mesaj başarıyla silindi",
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.user;

    const [result] = await db.execute(
      `INSERT INTO category_lists (title, create_user_id, created_at) VALUES (?, ?, NOW())`,
      [title, id]
    );

    const insertedId = result.insertId; // Eklenen kaydın ID’si

    res.json({
      status: true,
      message: "İşlem başarılı",
      id: insertedId, // ID’yi de response’a ekledik
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, error: err.message });
  }
};
