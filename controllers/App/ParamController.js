const db = require("../../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getCities = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM cities");

    res.json({ status: true,obj:rows});
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
