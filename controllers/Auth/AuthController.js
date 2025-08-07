const db = require("../../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

exports.login = async (req, res) => {
  try {
    console.log('loign')
    const email = req.body.email;
    const password = req.body.password;

    if (email == null) {
      return res.json({ status: false, error: "E-Mail adresi alınamadı" });
    }

    if (password == null) {
      return res.json({ status: false, error: "Şifre alınamadı" });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.json({ status: false, error: "Kullanıcı bulunamadı" });
    }

    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({ status: false, error: "Şifre yanlış.",user:null });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ status: true, user: user, token: token });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, city, password, password_rep } = req.body;

    if (!name) {
      return res.json({ status: false, message: "Ad soyad alınamadı." });
    }

    if (!email) {
      return res.json({ status: false, message: "E-Mail alınamadı." });
    }

    if (!city) {
      return res.json({ status: false, message: "Şehir alınamadı." });
    }

    if (!password) {
      return res.json({ status: false, message: "Şifre alınamadı." });
    }

    if (!password_rep) {
      return res.json({ status: false, message: "Şifre tekrar alınamadı." });
    }

    if (password !== password_rep) {
      return res.json({ status: false, message: "Girilen şifreler uyumsuz." });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.json({
        status: false,
        message: "Bu e-posta adresi zaten kayıtlı.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, city, password, created_at) VALUES (?, ?, ?,?, NOW())",
      [name, email, city, hashedPassword]
    );

    return res.json({ status: true, message: "Kayıt başarılı." });
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err.message });
  }
};

exports.replyVerCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ status: false, message: "E-Mail adresi alınamadı." });
    }
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.json({ status: false, message: "Kullanıcı bulunamadı" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail adresin
        pass: "xkxn ehzy pfat inwd", // Gmail şifren veya uygulama şifresi
      },
    });

    const length = 6;
    const code = Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    ).toString();

    await db.execute("UPDATE users SET code = ? WHERE email = ?", [
      code,
      email,
    ]);

    const templatePath = path.join(__dirname, "./../../mail/register.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    htmlContent = htmlContent.replace("{{name}}", rows[0].name);
    htmlContent = htmlContent.replace("{{code}}", code);

    const mailOptions = {
      from: `"Uygulama Adı" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Kayıt Başarılı - Hoş Geldiniz!",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      status: true,
      message: "Doğrulama kodu başarıyla gönderildi.",
    });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const { email, code } = req.body;

    const combinedCode = code.join("");

    if (!email) {
      return res.json({ status: false, message: "E-Mail alınamadı" });
    }

    if (!combinedCode) {
      return res.json({ status: false, message: "Şifre alınamadı" });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.json({ status: false, message: "Kullanıcı bulunamadı" });
    }

    if (rows[0].code == combinedCode) {
      await db.execute("UPDATE users SET verify = 1 WHERE email = ?", [email]);
      return res.json({
        status: true,
        message: "Kullanıcı kaydınız başarıyla doğrulandı.",
      });
    } else {
      return res.json({ status: false, message: "Girilen kod geçersiz." });
    }
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};
