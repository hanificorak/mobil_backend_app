const db = require("../../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getData = async (req, res) => {
  try {
    const { id } = req.user;

    const [user] = await db.execute(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    res.json({
      status: true,
      obj: user,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { name } = req.body;

    const [update] = await db.execute(
      `UPDATE users SET name = ? WHERE id = ?`,
      [name, id]
    );

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { current, ne_pas } = req.body;

    const [user_data] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    const user_item = user_data[0];

    
    if (!bcrypt.compareSync(current, user_item.password)) {
      res.json({
        status: false,
        type: 'last_error'
      });
    }
    const newHashPass = await bcrypt.hash(ne_pas, 10);


    const [update] = await db.execute(
      `UPDATE users SET password = ? WHERE id = ?`,
      [newHashPass, id]
    );

    res.json({
      status: true,
    });
  } catch (err) {
    // console.log(err)
    res.status(500).json({ status: false, error: err.message });
  }
};
